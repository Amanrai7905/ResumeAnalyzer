using Hangfire.Dashboard;

namespace ResumeAnalyzer.API.Filters
{
    public class AllowAllDashboardAuthorizationFilter : IDashboardAuthorizationFilter
    {
        public bool Authorize(DashboardContext context)
        {
            return true;
        }
    }
}
