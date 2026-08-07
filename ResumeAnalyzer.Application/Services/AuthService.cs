using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using ResumeAnalyzer.Application.Configurations;
using ResumeAnalyzer.Application.DTOs.Auth;
using ResumeAnalyzer.Application.Helpers;
using ResumeAnalyzer.Application.Interfaces;
using ResumeAnalyzer.Domain.Entities;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace ResumeAnalyzer.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly JwtSettings _jwtSettings;
        private readonly PasswordHasher<User> _passwordHasher;
        private readonly IRefreshTokenRepository _refreshTokenRepository;

        public AuthService(IUserRepository userRepository,IOptions<JwtSettings> jwtOptions, IRefreshTokenRepository refreshTokenRepository)
        {
            _userRepository = userRepository;
            _jwtSettings = jwtOptions.Value;
            _refreshTokenRepository = refreshTokenRepository;
            _passwordHasher = new PasswordHasher<User>();
        }

        public async Task RegisterAsync(RegisterDto registerDto)
        {
            var existingUser = await _userRepository.GetByEmailAsync(registerDto.Email);

            if (existingUser != null)
                throw new Exception("Email already exists.");

            var user = new User
            {
                FullName = registerDto.FullName,
                Email = registerDto.Email,
                Role = "User"
            };

            user.PasswordHash = _passwordHasher.HashPassword(user, registerDto.Password);

            await _userRepository.AddAsync(user);
        }

        public async Task<LoginResponseDto> LoginAsync(LoginDto loginDto)
        {
            var user = await _userRepository.GetByEmailAsync(loginDto.Email);

            if (user == null)
                throw new Exception("Invalid email or password.");

            var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, loginDto.Password);

            if (result == PasswordVerificationResult.Failed)
                throw new Exception("Invalid email or password.");

            var accessToken = GenerateJwtToken(user);

            var refreshToken = TokenGenerator.GenerateRefreshToken();

            var refreshTokenEntity = new RefreshToken
            {
                Token = refreshToken,
                UserId = user.Id,
                Created = DateTime.UtcNow,
                Expires = DateTime.UtcNow.AddDays(7),
                IsRevoked = false
            };
            await _refreshTokenRepository.AddAsync(refreshTokenEntity);

            return new LoginResponseDto
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                AccessTokenExpiration = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiryMinutes)
            };
        }

        public async Task<LoginResponseDto> RefreshTokenAsync(RefreshTokenRequestDto dto)
        {
            // Step 1: Find Refresh Token
            var storedToken = await _refreshTokenRepository.GetByTokenAsync(dto.RefreshToken);

            if (storedToken == null)
                throw new Exception("Invalid refresh token.");

            // Step 2: Check if revoked
            if (storedToken.IsRevoked)
                throw new Exception("Refresh token has been revoked.");

            // Step 3: Check expiry
            if (storedToken.Expires <= DateTime.UtcNow)
                throw new Exception("Refresh token has expired.");

            // Step 4: Get User
            var user = storedToken.User;

            // Step 5: Generate New Access Token
            var accessToken = GenerateJwtToken(user);

            // Step 6: Generate New Refresh Token
            var newRefreshToken = TokenGenerator.GenerateRefreshToken();

            // Step 7: Revoke Old Refresh Token
            storedToken.IsRevoked = true;
            await _refreshTokenRepository.UpdateAsync(storedToken);

            // Step 8: Save New Refresh Token
            var refreshTokenEntity = new RefreshToken
            {
                Token = newRefreshToken,
                UserId = user.Id,
                Created = DateTime.UtcNow,
                Expires = DateTime.UtcNow.AddDays(7),
                IsRevoked = false
            };

            await _refreshTokenRepository.AddAsync(refreshTokenEntity);

            // Step 9: Return New Tokens
            return new LoginResponseDto
            {
                AccessToken = accessToken,
                RefreshToken = newRefreshToken,
                AccessTokenExpiration = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiryMinutes)
            };
        }
        public async Task LogoutAsync(LogoutRequestDto dto)
        {
            var refreshToken =
                await _refreshTokenRepository.GetByTokenAsync(dto.RefreshToken);

            if (refreshToken == null)
                throw new Exception("Invalid refresh token.");

            if (refreshToken.IsRevoked)
                return;

            refreshToken.IsRevoked = true;

            await _refreshTokenRepository.UpdateAsync(refreshToken);
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(ClaimTypes.Name, user.FullName),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key));

            var credentials = new SigningCredentials(key,SecurityAlgorithms.HmacSha256);

            var expires = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiryMinutes);

            var token = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: claims,
                expires: expires,
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }
}
