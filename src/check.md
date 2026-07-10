/api/v1/analyzer/       apps.analyzer.views.analyze_data        analyze-all
/api/v1/analyzer/<int:assembly_id>/     apps.analyzer.views.analyze_data        analyze-assembly
/api/v1/auth/   rest_framework.routers.APIRootView      api-root
/api/v1/auth/<drf_format_suffix:format> rest_framework.routers.APIRootView      api-root
/api/v1/auth/assembly_admins/   apps.users.views.AssemblyAdminView      assembly_admins-list
/api/v1/auth/assembly_admins/<pk>/      apps.users.views.AssemblyAdminView      assembly_admins-detail
/api/v1/auth/auth/check-email/  apps.users.views.check_email    check_email
/api/v1/auth/auth/check-unique-user/    apps.users.views.UniqueUserCheckView    check_user-list
/api/v1/auth/auth/check-unique-user/<pk>/       apps.users.views.UniqueUserCheckView    check_user-detail
/api/v1/auth/docs/      drf_spectacular.views.SpectacularSwaggerView    swagger-ui
/api/v1/auth/jwt/create/        rest_framework_simplejwt.views.TokenObtainPairView      jwt-create
/api/v1/auth/jwt/refresh/       rest_framework_simplejwt.views.TokenRefreshView jwt-refresh
/api/v1/auth/jwt/verify/        rest_framework_simplejwt.views.TokenVerifyView  jwt-verify
/api/v1/auth/login/     apps.users.views.CustomLoginView        login
/api/v1/auth/logout/    apps.users.views.logout_view    logout
/api/v1/auth/schema/    drf_spectacular.views.SpectacularAPIView        schema
/api/v1/auth/signup/    apps.users.views.CreateUserView signup-list
/api/v1/auth/signup/<pk>/       apps.users.views.CreateUserView signup-detail
/api/v1/auth/user-church/       apps.users.views.UserView       user_church-list
/api/v1/auth/user-church/<pk>/  apps.users.views.UserView       user_church-detail
/api/v1/auth/user/      apps.users.views.UserView       user-list
/api/v1/auth/user/<pk>/ apps.users.views.UserView       user-detail
/api/v1/auth/user_auth_history/ apps.users.views.AuthHistoryView        auth_history-list
/api/v1/auth/user_auth_history/<pk>/    apps.users.views.AuthHistoryView        auth_history-detail
/api/v1/auth/user_update/       apps.users.views.UserView       user_update-list
/api/v1/auth/user_update/<pk>/  apps.users.views.UserView       user_update-detail
/api/v1/auth/users/     apps.users.views.ListUsersView  users-list
/api/v1/auth/users/     djoser.views.UserViewSet        user-list
/api/v1/auth/users/<id>/        djoser.views.UserViewSet        user-detail
/api/v1/auth/users/<id>\.<format>/      djoser.views.UserViewSet        user-detail
/api/v1/auth/users/<pk>/        apps.users.views.ListUsersView  users-detail
/api/v1/auth/users/activation/  djoser.views.UserViewSet        user-activation
/api/v1/auth/users/activation\.<format>/        djoser.views.UserViewSet        user-activation
/api/v1/auth/users/active/<int:church_id>/      apps.users.views.active_users   active_users
/api/v1/auth/users/me/  djoser.views.UserViewSet        user-me
/api/v1/auth/users/me\.<format>/        djoser.views.UserViewSet        user-me
/api/v1/auth/users/resend_activation/   djoser.views.UserViewSet        user-resend-activation
/api/v1/auth/users/resend_activation\.<format>/ djoser.views.UserViewSet        user-resend-activation
/api/v1/auth/users/reset_email/ djoser.views.UserViewSet        user-reset-username
/api/v1/auth/users/reset_email\.<format>/       djoser.views.UserViewSet        user-reset-username
/api/v1/auth/users/reset_email_confirm/ djoser.views.UserViewSet        user-reset-username-confirm
/api/v1/auth/users/reset_email_confirm\.<format>/       djoser.views.UserViewSet        user-reset-username-confirm
/api/v1/auth/users/reset_password/      djoser.views.UserViewSet        user-reset-password
/api/v1/auth/users/reset_password\.<format>/    djoser.views.UserViewSet        user-reset-password
/api/v1/auth/users/reset_password_confirm/      djoser.views.UserViewSet        user-reset-password-confirm
/api/v1/auth/users/reset_password_confirm\.<format>/    djoser.views.UserViewSet        user-reset-password-confirm
/api/v1/auth/users/set_email/   djoser.views.UserViewSet        user-set-username
/api/v1/auth/users/set_email\.<format>/ djoser.views.UserViewSet        user-set-username
/api/v1/auth/users/set_password/        djoser.views.UserViewSet        user-set-password
/api/v1/auth/users/set_password\.<format>/      djoser.views.UserViewSet        user-set-password
/api/v1/auth/users\.<format>/   djoser.views.UserViewSet        user-list
/api/v1/auth/verify/    apps.users.views.current_user   verify_user
/api/v1/bookkeeper/assets/      apps.bookkeeper.views.assets.AssetView  assets-list
/api/v1/bookkeeper/assets/<pk>/ apps.bookkeeper.views.assets.AssetView  assets-detail
/api/v1/bookkeeper/expenditure/ apps.bookkeeper.views.expenditure.ExpenditureView       expenditure-list
/api/v1/bookkeeper/expenditure/<pk>/    apps.bookkeeper.views.expenditure.ExpenditureView       expenditure-detail
/api/v1/bookkeeper/expenditure/download_expenditure_template/   apps.bookkeeper.views.expenditure.ExpenditureView      expenditure-download-expenditure-template
/api/v1/bookkeeper/expenditure/upload-image/    apps.bookkeeper.views.expenditure.ExpenditureView       expenditure-upload-image
/api/v1/bookkeeper/expenditure/upload_excel/    apps.bookkeeper.views.expenditure.ExpenditureView       expenditure-upload-excel
/api/v1/bookkeeper/finance/monthly-summary/     apps.bookkeeper.views.summary.FinanceSummaryView        finance-monthly-summary
/api/v1/bookkeeper/finance/yearly/      apps.bookkeeper.views.summary.FinanceYearlySummaryView  finance-yearly
/api/v1/bookkeeper/income/      apps.bookkeeper.views.income.IncomeView income-list
/api/v1/bookkeeper/income/<pk>/ apps.bookkeeper.views.income.IncomeView income-detail
/api/v1/bookkeeper/monthly/     apps.bookkeeper.views.summary.MonthlyIncomeSummaryView  monthly-list
/api/v1/bookkeeper/overhead/    apps.bookkeeper.views.overhead.OverheadViewSet  overhead-list
/api/v1/bookkeeper/overhead/<pk>/       apps.bookkeeper.views.overhead.OverheadViewSet  overhead-detail
/api/v1/bookkeeper/overhead/download_overhead_template/ apps.bookkeeper.views.overhead.OverheadViewSet  overhead-download-overhead-template
/api/v1/bookkeeper/overhead/upload_excel/       apps.bookkeeper.views.overhead.OverheadViewSet  overhead-upload-excel
/api/v1/bookkeeper/regular_expenditure/ apps.bookkeeper.views.expenditure.RegularExpenditureView        regular_expenditure-list
/api/v1/bookkeeper/regular_expenditure/<pk>/    apps.bookkeeper.views.expenditure.RegularExpenditureView        regular_expenditure-detail
/api/v1/bookkeeper/revenue/     apps.bookkeeper.views.revenue.RevenueViewSet    revenue-list
/api/v1/bookkeeper/revenue/<pk>/        apps.bookkeeper.views.revenue.RevenueViewSet    revenue-detail
/api/v1/bookkeeper/revenue/download_revenue_template/   apps.bookkeeper.views.revenue.RevenueViewSet    revenue-download-revenue-template
/api/v1/bookkeeper/revenue/upload_excel/        apps.bookkeeper.views.revenue.RevenueViewSet    revenue-upload-excel
/api/v1/bookkeeper/tithes/      apps.bookkeeper.views.tithes.TitheViewSet       tithes-list
/api/v1/bookkeeper/tithes/<pk>/ apps.bookkeeper.views.tithes.TitheViewSet       tithes-detail
/api/v1/bookkeeper/tithes/<pk>/restore/ apps.bookkeeper.views.tithes.TitheViewSet       tithes-restore
/api/v1/bookkeeper/tithes/audit-log/    apps.bookkeeper.views.tithes.TitheViewSet       tithes-audit-log
/api/v1/bookkeeper/tithes/contributors/ apps.bookkeeper.views.tithes.TitheViewSet       tithes-contributors
/api/v1/bookkeeper/tithes/download_tithe_template/      apps.bookkeeper.views.tithes.TitheViewSet       tithes-download-tithe-template
/api/v1/bookkeeper/tithes/performance/  apps.bookkeeper.views.tithes.TitheViewSet       tithes-performance
/api/v1/bookkeeper/tithes/receipts/     apps.bookkeeper.views.tithes.TitheViewSet       tithes-receipts
/api/v1/bookkeeper/tithes/trashed/      apps.bookkeeper.views.tithes.TitheViewSet       tithes-trashed
/api/v1/bookkeeper/tithes/upload_excel/ apps.bookkeeper.views.tithes.TitheViewSet       tithes-upload-excel
/api/v1/churches/assemblies/    apps.churches.views.ChurchView  assemblies-list
/api/v1/churches/assemblies/<public_id>/        apps.churches.views.ChurchView  assemblies-detail
/api/v1/core/blogs/     apps.core.views.BlogView        blogs-list
/api/v1/core/blogs/<slug>/      apps.core.views.BlogView        blogs-detail
/api/v1/core/documentation/     apps.core.views.DocumentationView       documentation-list
/api/v1/core/documentation/<pk>/        apps.core.views.DocumentationView       documentation-detail
/api/v1/core/terms/     apps.core.views.TermsView       terms-list
/api/v1/core/terms/<pk>/        apps.core.views.TermsView       terms-detail
/api/v1/core/terms/accept/      apps.core.views.AcceptTermsView terms-accept
/api/v1/core/terms/check/       apps.core.views.TermsCheckView  terms-check
/api/v1/people/ rest_framework.routers.APIRootView      people:api-root
/api/v1/people/<drf_format_suffix:format>       rest_framework.routers.APIRootView      people:api-root
/api/v1/people/attendance/      apps.people.views.attendance.AttendanceViewSet  people:attendance-list
/api/v1/people/attendance/<pk>/ apps.people.views.attendance.AttendanceViewSet  people:attendance-detail
/api/v1/people/attendance/<pk>/restore/ apps.people.views.attendance.AttendanceViewSet  people:attendance-restore
/api/v1/people/attendance/<pk>/restore\.<format>/       apps.people.views.attendance.AttendanceViewSet  people:attendance-restore
/api/v1/people/attendance/<pk>\.<format>/       apps.people.views.attendance.AttendanceViewSet  people:attendance-detail
/api/v1/people/attendance/bulk-create/  apps.people.views.attendance.AttendanceViewSet  people:attendance-bulk-create-workbench
/api/v1/people/attendance/bulk-create\.<format>/        apps.people.views.attendance.AttendanceViewSet  people:attendance-bulk-create-workbench
/api/v1/people/attendance/bulk_delete/  apps.people.views.attendance.AttendanceViewSet  people:attendance-bulk-delete
/api/v1/people/attendance/bulk_delete\.<format>/        apps.people.views.attendance.AttendanceViewSet  people:attendance-bulk-delete
/api/v1/people/attendance/bulk_restore/ apps.people.views.attendance.AttendanceViewSet  people:attendance-bulk-restore
/api/v1/people/attendance/bulk_restore\.<format>/       apps.people.views.attendance.AttendanceViewSet  people:attendance-bulk-restore
/api/v1/people/attendance/download_template/    apps.people.views.attendance.AttendanceViewSet  people:attendance-download-template
/api/v1/people/attendance/download_template\.<format>/  apps.people.views.attendance.AttendanceViewSet  people:attendance-download-template
/api/v1/people/attendance/upload_excel/ apps.people.views.attendance.AttendanceViewSet  people:attendance-upload-excel
/api/v1/people/attendance/upload_excel\.<format>/       apps.people.views.attendance.AttendanceViewSet  people:attendance-upload-excel
/api/v1/people/attendance\.<format>/    apps.people.views.attendance.AttendanceViewSet  people:attendance-list
/api/v1/people/belong/check-in/ apps.people.views.belong.verify_member_pin      people:verify-member-pin
/api/v1/people/belong/check-member/     apps.people.views.belong.check_member_existence people:check-member
/api/v1/people/belong/member/<str:member_key>/  apps.people.views.belong.get_member_data        people:get_member_data
/api/v1/people/belong/reset-pin/        apps.people.views.belong.reset_member_pin       people:reset-member-pin
/api/v1/people/belong/set-pin/  apps.people.views.belong.set_member_pin people:set-member-pin
/api/v1/people/homecells/       apps.people.views.spaces.HomecellView   people:homecell-list
/api/v1/people/homecells/<pk>/  apps.people.views.spaces.HomecellView   people:homecell-detail
/api/v1/people/homecells/<pk>\.<format>/        apps.people.views.spaces.HomecellView   people:homecell-detail
/api/v1/people/homecells\.<format>/     apps.people.views.spaces.HomecellView   people:homecell-list
/api/v1/people/junior_members/  apps.people.views.members.JuniorMemberView      people:junior_members-list
/api/v1/people/junior_members/<member_key>/     apps.people.views.members.JuniorMemberView      people:junior_members-detail
/api/v1/people/junior_members/<member_key>\.<format>/   apps.people.views.members.JuniorMemberView      people:junior_members-detail
/api/v1/people/junior_members\.<format>/        apps.people.views.members.JuniorMemberView      people:junior_members-list
/api/v1/people/members/ apps.people.views.members.MemberView    people:members-list
/api/v1/people/members/<member_key>/    apps.people.views.members.MemberView    people:members-detail
/api/v1/people/members/<member_key>\.<format>/  apps.people.views.members.MemberView    people:members-detail
/api/v1/people/members\.<format>/       apps.people.views.members.MemberView    people:members-list
/api/v1/people/sunday-school-attendance/        apps.people.views.sunday_school.SundaySchoolAttendanceViewSet   people:sunday-school-attendance-list
/api/v1/people/sunday-school-attendance/<pk>/   apps.people.views.sunday_school.SundaySchoolAttendanceViewSet   people:sunday-school-attendance-detail
/api/v1/people/sunday-school-attendance/<pk>/approve/   apps.people.views.sunday_school.SundaySchoolAttendanceViewSet  people:sunday-school-attendance-approve
/api/v1/people/sunday-school-attendance/<pk>/approve\.<format>/ apps.people.views.sunday_school.SundaySchoolAttendanceViewSet   people:sunday-school-attendance-approve
/api/v1/people/sunday-school-attendance/<pk>/reject/    apps.people.views.sunday_school.SundaySchoolAttendanceViewSet  people:sunday-school-attendance-reject
/api/v1/people/sunday-school-attendance/<pk>/reject\.<format>/  apps.people.views.sunday_school.SundaySchoolAttendanceViewSet   people:sunday-school-attendance-reject
/api/v1/people/sunday-school-attendance/<pk>/restore/   apps.people.views.sunday_school.SundaySchoolAttendanceViewSet  people:sunday-school-attendance-restore
/api/v1/people/sunday-school-attendance/<pk>/restore\.<format>/ apps.people.views.sunday_school.SundaySchoolAttendanceViewSet   people:sunday-school-attendance-restore
/api/v1/people/sunday-school-attendance/<pk>/review/    apps.people.views.sunday_school.SundaySchoolAttendanceViewSet  people:sunday-school-attendance-review
/api/v1/people/sunday-school-attendance/<pk>/review\.<format>/  apps.people.views.sunday_school.SundaySchoolAttendanceViewSet   people:sunday-school-attendance-review
/api/v1/people/sunday-school-attendance/<pk>/submit/    apps.people.views.sunday_school.SundaySchoolAttendanceViewSet  people:sunday-school-attendance-submit
/api/v1/people/sunday-school-attendance/<pk>/submit\.<format>/  apps.people.views.sunday_school.SundaySchoolAttendanceViewSet   people:sunday-school-attendance-submit
/api/v1/people/sunday-school-attendance/<pk>\.<format>/ apps.people.views.sunday_school.SundaySchoolAttendanceViewSet  people:sunday-school-attendance-detail
/api/v1/people/sunday-school-attendance/aggregates/     apps.people.views.sunday_school.SundaySchoolAttendanceViewSet  people:sunday-school-attendance-aggregates
/api/v1/people/sunday-school-attendance/aggregates\.<format>/   apps.people.views.sunday_school.SundaySchoolAttendanceViewSet   people:sunday-school-attendance-aggregates
/api/v1/people/sunday-school-attendance/bulk_delete/    apps.people.views.sunday_school.SundaySchoolAttendanceViewSet  people:sunday-school-attendance-bulk-delete
/api/v1/people/sunday-school-attendance/bulk_delete\.<format>/  apps.people.views.sunday_school.SundaySchoolAttendanceViewSet   people:sunday-school-attendance-bulk-delete
/api/v1/people/sunday-school-attendance/bulk_restore/   apps.people.views.sunday_school.SundaySchoolAttendanceViewSet  people:sunday-school-attendance-bulk-restore
/api/v1/people/sunday-school-attendance/bulk_restore\.<format>/ apps.people.views.sunday_school.SundaySchoolAttendanceViewSet   people:sunday-school-attendance-bulk-restore
/api/v1/people/sunday-school-attendance\.<format>/      apps.people.views.sunday_school.SundaySchoolAttendanceViewSet  people:sunday-school-attendance-list
/api/v1/posts/post/comment/     apps.posts.views.CreatePostCommentView  post_comment-list
/api/v1/posts/post/comment/<pk>/        apps.posts.views.CreatePostCommentView  post_comment-detail
/api/v1/posts/post/create/      apps.posts.views.CreatePostView create_post-list
/api/v1/posts/post/create/<pk>/ apps.posts.views.CreatePostView create_post-detail
/api/v1/posts/post_update/      apps.posts.views.UpdatePostView update_post-list
/api/v1/posts/post_update/<pk>/ apps.posts.views.UpdatePostView update_post-detail
/api/v1/posts/posts/    apps.posts.views.PostView       posts-list
/api/v1/posts/posts/<pk>/       apps.posts.views.PostView       posts-detail
/api/v1/regions/churches/       apps.churches.regional_views.RegionalChurchesView       regional-churches
/api/v1/regions/users/  apps.churches.regional_views.RegionalUsersView  regional-users
/api/v1/reports/        apps.reports.views.assembly.ReportViewSet       reports:assembly_report-list
/api/v1/reports/<pk>/   apps.reports.views.assembly.ReportViewSet       reports:assembly_report-detail
/api/v1/reports/<pk>/attendance/        apps.reports.views.assembly.ReportViewSet       reports:assembly_report-attendance
/api/v1/reports/<pk>/cashflow/  apps.reports.views.assembly.ReportViewSet       reports:assembly_report-cashflow
/api/v1/reports/<pk>/cashflow_summary/  apps.reports.views.assembly.ReportViewSet       reports:assembly_report-cashflow-summary
/api/v1/reports/<pk>/compliance/        apps.reports.views.assembly.ReportViewSet       reports:assembly_report-compliance
/api/v1/reports/<pk>/expenses/  apps.reports.views.assembly.ReportViewSet       reports:assembly_report-expenses
/api/v1/reports/<pk>/finalize/  apps.reports.views.assembly.ReportViewSet       reports:assembly_report-finalize
/api/v1/reports/<pk>/highlights/        apps.reports.views.assembly.ReportViewSet       reports:assembly_report-highlights
/api/v1/reports/<pk>/income/    apps.reports.views.assembly.ReportViewSet       reports:assembly_report-income
/api/v1/reports/<pk>/overheads/ apps.reports.views.assembly.ReportViewSet       reports:assembly_report-overheads
/api/v1/reports/<pk>/overview/  apps.reports.views.assembly.ReportViewSet       reports:assembly_report-overview
/api/v1/reports/<pk>/revenue/   apps.reports.views.assembly.ReportViewSet       reports:assembly_report-revenue
/api/v1/reports/<pk>/tithes/    apps.reports.views.assembly.ReportViewSet       reports:assembly_report-tithes
/api/v1/reports/alerts/ apps.reports.views.alert_viewset.AlertViewSet   reports:alerts-list
/api/v1/reports/alerts/<pk>/    apps.reports.views.alert_viewset.AlertViewSet   reports:alerts-detail
/api/v1/reports/alerts/<pk>/acknowledge/        apps.reports.views.alert_viewset.AlertViewSet   reports:alerts-acknowledge
/api/v1/reports/alerts/<pk>/resolve/    apps.reports.views.alert_viewset.AlertViewSet   reports:alerts-resolve
/api/v1/reports/audit-logs/     apps.reports.views.audit.AuditLogViewSet        reports:audit-logs-list
/api/v1/reports/audit-logs/<pk>/        apps.reports.views.audit.AuditLogViewSet        reports:audit-logs-detail
/api/v1/reports/compliance/assemblies/  apps.reports.views.compliance.AssemblyComplianceViewSet reports:assembly-compliance-list
/api/v1/reports/compliance/assemblies/<pk>/     apps.reports.views.compliance.AssemblyComplianceViewSet reports:assembly-compliance-detail
/api/v1/reports/compliance/dashboard/   apps.reports.views.compliance.ComplianceDashboardView   reports:compliance-dashboard
/api/v1/reports/compliance/zones/       apps.reports.views.compliance.ZoneComplianceViewSet     reports:zone-compliance-list
/api/v1/reports/compliance/zones/<pk>/  apps.reports.views.compliance.ZoneComplianceViewSet     reports:zone-compliance-detail
/api/v1/reports/compliance/zones/<pk>/download/ apps.reports.views.compliance.ZoneComplianceViewSet     reports:zone-compliance-download
/api/v1/reports/metrics/regions/<pk>/   apps.reports.views.region_viewset.RegionViewSet reports:region-metrics-detail
/api/v1/reports/metrics/regions/<pk>/<domain>/  apps.reports.views.region_viewset.RegionViewSet reports:region-metrics-module
/api/v1/reports/metrics/regions/<pk>/compliance/aggregate/      apps.reports.views.region_viewset.RegionViewSet reports:region-metrics-compliance-aggregate
/api/v1/reports/metrics/regions/<pk>/compliance/audit-log/      apps.reports.views.region_viewset.RegionViewSet reports:region-metrics-compliance-audit-log
/api/v1/reports/metrics/regions/<pk>/compliance/monthly-report.pdf/     apps.reports.views.region_viewset.RegionViewSetreports:region-metrics-monthly-compliance-report-pdf
/api/v1/reports/metrics/regions/<pk>/compliance/scorecard/      apps.reports.views.region_viewset.RegionViewSet reports:region-metrics-compliance-scorecard
/api/v1/reports/metrics/regions/<pk>/countries/<country>/       apps.reports.views.region_viewset.RegionViewSet reports:region-metrics-country
/api/v1/reports/metrics/regions/<pk>/finance/aggregate/ apps.reports.views.region_viewset.RegionViewSet reports:region-metrics-finance-aggregate
/api/v1/reports/metrics/regions/<pk>/growth/aggregate/  apps.reports.views.region_viewset.RegionViewSet reports:region-metrics-growth-aggregate
/api/v1/reports/metrics/regions/<pk>/leadership/aggregate/      apps.reports.views.region_viewset.RegionViewSet reports:region-metrics-leadership-aggregate
/api/v1/reports/metrics/regions/<pk>/metrics/<domain>/  apps.reports.views.region_viewset.RegionViewSet reports:region-metrics-metric-module
/api/v1/reports/metrics/regions/<pk>/ministry/aggregate/        apps.reports.views.region_viewset.RegionViewSet reports:region-metrics-ministry-aggregate
/api/v1/reports/metrics/regions/<pk>/overview/  apps.reports.views.region_viewset.RegionViewSet reports:region-metrics-overview
/api/v1/reports/metrics/regions/<pk>/risk/aggregate/    apps.reports.views.region_viewset.RegionViewSet reports:region-metrics-risk-aggregate
/api/v1/reports/metrics/regions/<pk>/zones/<zone_id>/compliance/        apps.reports.views.region_viewset.RegionViewSetreports:region-metrics-zone-compliance
/api/v1/reports/metrics/zones/<pk>/     apps.reports.views.zone_viewset.ZoneMetricsViewSet      reports:zone-metrics-detail
/api/v1/reports/region/<int:pk>/compliance/     apps.reports.views.region_viewset.RegionViewSet reports:regional-compliance
/api/v1/reports/region/<int:pk>/compliance/monthly-report.pdf   apps.reports.views.region_viewset.RegionViewSet reports:regional-compliance-monthly-report-pdf
/api/v1/reports/region/<int:pk>/finance/        apps.reports.views.region_viewset.RegionViewSet reports:regional-finance
/api/v1/reports/region/<int:pk>/growth/ apps.reports.views.region_viewset.RegionViewSet reports:regional-growth
/api/v1/reports/region/<int:pk>/leadership/     apps.reports.views.region_viewset.RegionViewSet reports:regional-leadership
/api/v1/reports/region/<int:pk>/ministry/       apps.reports.views.region_viewset.RegionViewSet reports:regional-ministry
/api/v1/reports/region/<int:pk>/overview/       apps.reports.views.region_viewset.RegionViewSet reports:regional-overview
/api/v1/reports/region/<int:pk>/risk/   apps.reports.views.region_viewset.RegionViewSet reports:regional-risk
/api/v1/reports/region/metrics/<int:pk>/<str:domain>/   apps.reports.views.region_viewset.RegionViewSet reports:region-metrics-module
/api/v1/reports/region/metrics/<int:pk>/compliance/aggregate/   apps.reports.views.region_viewset.RegionViewSet reports:region-compliance-aggregate
/api/v1/reports/region/metrics/<int:pk>/compliance/audit-log/   apps.reports.views.region_viewset.RegionViewSet reports:region-compliance-audit-log
/api/v1/reports/region/metrics/<int:pk>/compliance/scorecard/   apps.reports.views.region_viewset.RegionViewSet reports:region-compliance-scorecard
/api/v1/reports/region/metrics/<int:pk>/finance/aggregate/      apps.reports.views.region_viewset.RegionViewSet reports:region-finance-aggregate
/api/v1/reports/region/metrics/<int:pk>/growth/aggregate/       apps.reports.views.region_viewset.RegionViewSet reports:region-growth-aggregate
/api/v1/reports/region/metrics/<int:pk>/leadership/aggregate/   apps.reports.views.region_viewset.RegionViewSet reports:region-leadership-aggregate
/api/v1/reports/region/metrics/<int:pk>/ministry/aggregate/     apps.reports.views.region_viewset.RegionViewSet reports:region-ministry-aggregate
/api/v1/reports/region/metrics/<int:pk>/overview/       apps.reports.views.region_viewset.RegionViewSet reports:region-metrics-overview
/api/v1/reports/region/metrics/<int:pk>/risk/aggregate/ apps.reports.views.region_viewset.RegionViewSet reports:region-risk-aggregate
/api/v1/reports/sections/       apps.reports.views.section_viewset.ReportSectionViewSet reports:sections-list
/api/v1/reports/sections/<pk>/  apps.reports.views.section_viewset.ReportSectionViewSet reports:sections-detail
/api/v1/reports/sections/<pk>/reset/    apps.reports.views.section_viewset.ReportSectionViewSet reports:sections-reset
/api/v1/reports/sections/<pk>/skip/     apps.reports.views.section_viewset.ReportSectionViewSet reports:sections-skip
/api/v1/reports/sections/<pk>/submit/   apps.reports.views.section_viewset.ReportSectionViewSet reports:sections-submit
/api/v1/reports/summary/attendance/     apps.reports.views.assembly.ReportViewSet       reports:assembly_report-attendance-summary
/api/v1/reports/summary/cashflow/       apps.reports.views.assembly.ReportViewSet       reports:assembly_report-cashflow-year-summary
/api/v1/reports/summary/tithes/ apps.reports.views.assembly.ReportViewSet       reports:assembly_report-tithes-summary
/api/v1/reports/zone-reports/<int:zone_id>/     apps.reports.views.zone.ZoneReportView  reports:zone-reports
/media/<path>   django.views.static.serve
/portal-a26e12/ django.contrib.admin.sites.index        admin:index
/portal-a26e12/<app_label>/     django.contrib.admin.sites.app_index    admin:app_list
/portal-a26e12/<url>    django.contrib.admin.sites.catch_all_view
/portal-a26e12/auth/group/      django.contrib.admin.options.changelist_view    admin:auth_group_changelist
/portal-a26e12/auth/group/<path:object_id>/     django.views.generic.base.RedirectView
/portal-a26e12/auth/group/<path:object_id>/change/      django.contrib.admin.options.change_view        admin:auth_group_change
/portal-a26e12/auth/group/<path:object_id>/delete/      django.contrib.admin.options.delete_view        admin:auth_group_delete
/portal-a26e12/auth/group/<path:object_id>/history/     django.contrib.admin.options.history_view       admin:auth_group_history
/portal-a26e12/auth/group/add/  django.contrib.admin.options.add_view   admin:auth_group_add
/portal-a26e12/autocomplete/    django.contrib.admin.sites.autocomplete_view    admin:autocomplete
/portal-a26e12/bookkeeper/asset/        django.contrib.admin.options.changelist_view    admin:bookkeeper_asset_changelist
/portal-a26e12/bookkeeper/asset/<path:object_id>/       django.views.generic.base.RedirectView
/portal-a26e12/bookkeeper/asset/<path:object_id>/change/        django.contrib.admin.options.change_view        admin:bookkeeper_asset_change
/portal-a26e12/bookkeeper/asset/<path:object_id>/delete/        django.contrib.admin.options.delete_view        admin:bookkeeper_asset_delete
/portal-a26e12/bookkeeper/asset/<path:object_id>/history/       django.contrib.admin.options.history_view       admin:bookkeeper_asset_history
/portal-a26e12/bookkeeper/asset/add/    django.contrib.admin.options.add_view   admin:bookkeeper_asset_add
/portal-a26e12/bookkeeper/assetimage/   django.contrib.admin.options.changelist_view    admin:bookkeeper_assetimage_changelist
/portal-a26e12/bookkeeper/assetimage/<path:object_id>/  django.views.generic.base.RedirectView
/portal-a26e12/bookkeeper/assetimage/<path:object_id>/change/   django.contrib.admin.options.change_view        admin:bookkeeper_assetimage_change
/portal-a26e12/bookkeeper/assetimage/<path:object_id>/delete/   django.contrib.admin.options.delete_view        admin:bookkeeper_assetimage_delete
/portal-a26e12/bookkeeper/assetimage/<path:object_id>/history/  django.contrib.admin.options.history_view       admin:bookkeeper_assetimage_history
/portal-a26e12/bookkeeper/assetimage/add/       django.contrib.admin.options.add_view   admin:bookkeeper_assetimage_add
/portal-a26e12/bookkeeper/expenditure/  django.contrib.admin.options.changelist_view    admin:bookkeeper_expenditure_changelist
/portal-a26e12/bookkeeper/expenditure/<path:object_id>/ django.views.generic.base.RedirectView
/portal-a26e12/bookkeeper/expenditure/<path:object_id>/change/  django.contrib.admin.options.change_view        admin:bookkeeper_expenditure_change
/portal-a26e12/bookkeeper/expenditure/<path:object_id>/delete/  django.contrib.admin.options.delete_view        admin:bookkeeper_expenditure_delete
/portal-a26e12/bookkeeper/expenditure/<path:object_id>/history/ django.contrib.admin.options.history_view       admin:bookkeeper_expenditure_history
/portal-a26e12/bookkeeper/expenditure/add/      django.contrib.admin.options.add_view   admin:bookkeeper_expenditure_add
/portal-a26e12/bookkeeper/financialauditlog/    django.contrib.admin.options.changelist_view    admin:bookkeeper_financialauditlog_changelist
/portal-a26e12/bookkeeper/financialauditlog/<path:object_id>/   django.views.generic.base.RedirectView
/portal-a26e12/bookkeeper/financialauditlog/<path:object_id>/change/    django.contrib.admin.options.change_view       admin:bookkeeper_financialauditlog_change
/portal-a26e12/bookkeeper/financialauditlog/<path:object_id>/delete/    django.contrib.admin.options.delete_view       admin:bookkeeper_financialauditlog_delete
/portal-a26e12/bookkeeper/financialauditlog/<path:object_id>/history/   django.contrib.admin.options.history_view      admin:bookkeeper_financialauditlog_history
/portal-a26e12/bookkeeper/financialauditlog/add/        django.contrib.admin.options.add_view   admin:bookkeeper_financialauditlog_add
/portal-a26e12/bookkeeper/fixedexpenditure/     django.contrib.admin.options.changelist_view    admin:bookkeeper_fixedexpenditure_changelist
/portal-a26e12/bookkeeper/fixedexpenditure/<path:object_id>/    django.views.generic.base.RedirectView
/portal-a26e12/bookkeeper/fixedexpenditure/<path:object_id>/change/     django.contrib.admin.options.change_view       admin:bookkeeper_fixedexpenditure_change
/portal-a26e12/bookkeeper/fixedexpenditure/<path:object_id>/delete/     django.contrib.admin.options.delete_view       admin:bookkeeper_fixedexpenditure_delete
/portal-a26e12/bookkeeper/fixedexpenditure/<path:object_id>/history/    django.contrib.admin.options.history_view      admin:bookkeeper_fixedexpenditure_history
/portal-a26e12/bookkeeper/fixedexpenditure/add/ django.contrib.admin.options.add_view   admin:bookkeeper_fixedexpenditure_add
/portal-a26e12/bookkeeper/income/       django.contrib.admin.options.changelist_view    admin:bookkeeper_income_changelist
/portal-a26e12/bookkeeper/income/<path:object_id>/      django.views.generic.base.RedirectView
/portal-a26e12/bookkeeper/income/<path:object_id>/change/       django.contrib.admin.options.change_view        admin:bookkeeper_income_change
/portal-a26e12/bookkeeper/income/<path:object_id>/delete/       django.contrib.admin.options.delete_view        admin:bookkeeper_income_delete
/portal-a26e12/bookkeeper/income/<path:object_id>/history/      django.contrib.admin.options.history_view       admin:bookkeeper_income_history
/portal-a26e12/bookkeeper/income/add/   django.contrib.admin.options.add_view   admin:bookkeeper_income_add
/portal-a26e12/bookkeeper/monthlyfinancesnapshot/       django.contrib.admin.options.changelist_view    admin:bookkeeper_monthlyfinancesnapshot_changelist
/portal-a26e12/bookkeeper/monthlyfinancesnapshot/<path:object_id>/      django.views.generic.base.RedirectView
/portal-a26e12/bookkeeper/monthlyfinancesnapshot/<path:object_id>/change/       django.contrib.admin.options.change_viewadmin:bookkeeper_monthlyfinancesnapshot_change
/portal-a26e12/bookkeeper/monthlyfinancesnapshot/<path:object_id>/delete/       django.contrib.admin.options.delete_viewadmin:bookkeeper_monthlyfinancesnapshot_delete
/portal-a26e12/bookkeeper/monthlyfinancesnapshot/<path:object_id>/history/      django.contrib.admin.options.history_view       admin:bookkeeper_monthlyfinancesnapshot_history
/portal-a26e12/bookkeeper/monthlyfinancesnapshot/add/   django.contrib.admin.options.add_view   admin:bookkeeper_monthlyfinancesnapshot_add
/portal-a26e12/bookkeeper/overhead/     django.contrib.admin.options.changelist_view    admin:bookkeeper_overhead_changelist
/portal-a26e12/bookkeeper/overhead/<path:object_id>/    django.views.generic.base.RedirectView
/portal-a26e12/bookkeeper/overhead/<path:object_id>/change/     django.contrib.admin.options.change_view        admin:bookkeeper_overhead_change
/portal-a26e12/bookkeeper/overhead/<path:object_id>/delete/     django.contrib.admin.options.delete_view        admin:bookkeeper_overhead_delete
/portal-a26e12/bookkeeper/overhead/<path:object_id>/history/    django.contrib.admin.options.history_view       admin:bookkeeper_overhead_history
/portal-a26e12/bookkeeper/overhead/add/ django.contrib.admin.options.add_view   admin:bookkeeper_overhead_add
/portal-a26e12/bookkeeper/overheadtype/ django.contrib.admin.options.changelist_view    admin:bookkeeper_overheadtype_changelist
/portal-a26e12/bookkeeper/overheadtype/<path:object_id>/        django.views.generic.base.RedirectView
/portal-a26e12/bookkeeper/overheadtype/<path:object_id>/change/ django.contrib.admin.options.change_view        admin:bookkeeper_overheadtype_change
/portal-a26e12/bookkeeper/overheadtype/<path:object_id>/delete/ django.contrib.admin.options.delete_view        admin:bookkeeper_overheadtype_delete
/portal-a26e12/bookkeeper/overheadtype/<path:object_id>/history/        django.contrib.admin.options.history_view      admin:bookkeeper_overheadtype_history
/portal-a26e12/bookkeeper/overheadtype/add/     django.contrib.admin.options.add_view   admin:bookkeeper_overheadtype_add
/portal-a26e12/bookkeeper/revenue/      django.contrib.admin.options.changelist_view    admin:bookkeeper_revenue_changelist
/portal-a26e12/bookkeeper/revenue/<path:object_id>/     django.views.generic.base.RedirectView
/portal-a26e12/bookkeeper/revenue/<path:object_id>/change/      django.contrib.admin.options.change_view        admin:bookkeeper_revenue_change
/portal-a26e12/bookkeeper/revenue/<path:object_id>/delete/      django.contrib.admin.options.delete_view        admin:bookkeeper_revenue_delete
/portal-a26e12/bookkeeper/revenue/<path:object_id>/history/     django.contrib.admin.options.history_view       admin:bookkeeper_revenue_history
/portal-a26e12/bookkeeper/revenue/add/  django.contrib.admin.options.add_view   admin:bookkeeper_revenue_add
/portal-a26e12/bookkeeper/revenuecategory/      django.contrib.admin.options.changelist_view    admin:bookkeeper_revenuecategory_changelist
/portal-a26e12/bookkeeper/revenuecategory/<path:object_id>/     django.views.generic.base.RedirectView
/portal-a26e12/bookkeeper/revenuecategory/<path:object_id>/change/      django.contrib.admin.options.change_view       admin:bookkeeper_revenuecategory_change
/portal-a26e12/bookkeeper/revenuecategory/<path:object_id>/delete/      django.contrib.admin.options.delete_view       admin:bookkeeper_revenuecategory_delete
/portal-a26e12/bookkeeper/revenuecategory/<path:object_id>/history/     django.contrib.admin.options.history_view      admin:bookkeeper_revenuecategory_history
/portal-a26e12/bookkeeper/revenuecategory/add/  django.contrib.admin.options.add_view   admin:bookkeeper_revenuecategory_add
/portal-a26e12/bookkeeper/tithe/        django.contrib.admin.options.changelist_view    admin:bookkeeper_tithe_changelist
/portal-a26e12/bookkeeper/tithe/<path:object_id>/       django.views.generic.base.RedirectView
/portal-a26e12/bookkeeper/tithe/<path:object_id>/change/        django.contrib.admin.options.change_view        admin:bookkeeper_tithe_change
/portal-a26e12/bookkeeper/tithe/<path:object_id>/delete/        django.contrib.admin.options.delete_view        admin:bookkeeper_tithe_delete
/portal-a26e12/bookkeeper/tithe/<path:object_id>/history/       django.contrib.admin.options.history_view       admin:bookkeeper_tithe_history
/portal-a26e12/bookkeeper/tithe/add/    django.contrib.admin.options.add_view   admin:bookkeeper_tithe_add
/portal-a26e12/churches/assemblycurrency/       django.contrib.admin.options.changelist_view    admin:churches_assemblycurrency_changelist
/portal-a26e12/churches/assemblycurrency/<path:object_id>/      django.views.generic.base.RedirectView
/portal-a26e12/churches/assemblycurrency/<path:object_id>/change/       django.contrib.admin.options.change_view       admin:churches_assemblycurrency_change
/portal-a26e12/churches/assemblycurrency/<path:object_id>/delete/       django.contrib.admin.options.delete_view       admin:churches_assemblycurrency_delete
/portal-a26e12/churches/assemblycurrency/<path:object_id>/history/      django.contrib.admin.options.history_view      admin:churches_assemblycurrency_history
/portal-a26e12/churches/assemblycurrency/add/   django.contrib.admin.options.add_view   admin:churches_assemblycurrency_add
/portal-a26e12/churches/church/ django.contrib.admin.options.changelist_view    admin:churches_church_changelist
/portal-a26e12/churches/church/<path:object_id>/        django.views.generic.base.RedirectView
/portal-a26e12/churches/church/<path:object_id>/change/ django.contrib.admin.options.change_view        admin:churches_church_change
/portal-a26e12/churches/church/<path:object_id>/delete/ django.contrib.admin.options.delete_view        admin:churches_church_delete
/portal-a26e12/churches/church/<path:object_id>/history/        django.contrib.admin.options.history_view       admin:churches_church_history
/portal-a26e12/churches/church/add/     django.contrib.admin.options.add_view   admin:churches_church_add
/portal-a26e12/churches/churchmeeting/  django.contrib.admin.options.changelist_view    admin:churches_churchmeeting_changelist
/portal-a26e12/churches/churchmeeting/<path:object_id>/ django.views.generic.base.RedirectView
/portal-a26e12/churches/churchmeeting/<path:object_id>/change/  django.contrib.admin.options.change_view        admin:churches_churchmeeting_change
/portal-a26e12/churches/churchmeeting/<path:object_id>/delete/  django.contrib.admin.options.delete_view        admin:churches_churchmeeting_delete
/portal-a26e12/churches/churchmeeting/<path:object_id>/history/ django.contrib.admin.options.history_view       admin:churches_churchmeeting_history
/portal-a26e12/churches/churchmeeting/add/      django.contrib.admin.options.add_view   admin:churches_churchmeeting_add
/portal-a26e12/churches/forecast/       django.contrib.admin.options.changelist_view    admin:churches_forecast_changelist
/portal-a26e12/churches/forecast/<path:object_id>/      django.views.generic.base.RedirectView
/portal-a26e12/churches/forecast/<path:object_id>/change/       django.contrib.admin.options.change_view        admin:churches_forecast_change
/portal-a26e12/churches/forecast/<path:object_id>/delete/       django.contrib.admin.options.delete_view        admin:churches_forecast_delete
/portal-a26e12/churches/forecast/<path:object_id>/history/      django.contrib.admin.options.history_view       admin:churches_forecast_history
/portal-a26e12/churches/forecast/add/   django.contrib.admin.options.add_view   admin:churches_forecast_add
/portal-a26e12/churches/outreach/       django.contrib.admin.options.changelist_view    admin:churches_outreach_changelist
/portal-a26e12/churches/outreach/<path:object_id>/      django.views.generic.base.RedirectView
/portal-a26e12/churches/outreach/<path:object_id>/change/       django.contrib.admin.options.change_view        admin:churches_outreach_change
/portal-a26e12/churches/outreach/<path:object_id>/delete/       django.contrib.admin.options.delete_view        admin:churches_outreach_delete
/portal-a26e12/churches/outreach/<path:object_id>/history/      django.contrib.admin.options.history_view       admin:churches_outreach_history
/portal-a26e12/churches/outreach/add/   django.contrib.admin.options.add_view   admin:churches_outreach_add
/portal-a26e12/churches/region/ django.contrib.admin.options.changelist_view    admin:churches_region_changelist
/portal-a26e12/churches/region/<path:object_id>/        django.views.generic.base.RedirectView
/portal-a26e12/churches/region/<path:object_id>/change/ django.contrib.admin.options.change_view        admin:churches_region_change
/portal-a26e12/churches/region/<path:object_id>/delete/ django.contrib.admin.options.delete_view        admin:churches_region_delete
/portal-a26e12/churches/region/<path:object_id>/history/        django.contrib.admin.options.history_view       admin:churches_region_history
/portal-a26e12/churches/region/add/     django.contrib.admin.options.add_view   admin:churches_region_add
/portal-a26e12/churches/regionleadership/       django.contrib.admin.options.changelist_view    admin:churches_regionleadership_changelist
/portal-a26e12/churches/regionleadership/<path:object_id>/      django.views.generic.base.RedirectView
/portal-a26e12/churches/regionleadership/<path:object_id>/change/       django.contrib.admin.options.change_view       admin:churches_regionleadership_change
/portal-a26e12/churches/regionleadership/<path:object_id>/delete/       django.contrib.admin.options.delete_view       admin:churches_regionleadership_delete
/portal-a26e12/churches/regionleadership/<path:object_id>/history/      django.contrib.admin.options.history_view      admin:churches_regionleadership_history
/portal-a26e12/churches/regionleadership/add/   django.contrib.admin.options.add_view   admin:churches_regionleadership_add
/portal-a26e12/churches/zone/   django.contrib.admin.options.changelist_view    admin:churches_zone_changelist
/portal-a26e12/churches/zone/<path:object_id>/  django.views.generic.base.RedirectView
/portal-a26e12/churches/zone/<path:object_id>/change/   django.contrib.admin.options.change_view        admin:churches_zone_change
/portal-a26e12/churches/zone/<path:object_id>/delete/   django.contrib.admin.options.delete_view        admin:churches_zone_delete
/portal-a26e12/churches/zone/<path:object_id>/history/  django.contrib.admin.options.history_view       admin:churches_zone_history
/portal-a26e12/churches/zone/add/       django.contrib.admin.options.add_view   admin:churches_zone_add
/portal-a26e12/churches/zoneleadership/ django.contrib.admin.options.changelist_view    admin:churches_zoneleadership_changelist
/portal-a26e12/churches/zoneleadership/<path:object_id>/        django.views.generic.base.RedirectView
/portal-a26e12/churches/zoneleadership/<path:object_id>/change/ django.contrib.admin.options.change_view        admin:churches_zoneleadership_change
/portal-a26e12/churches/zoneleadership/<path:object_id>/delete/ django.contrib.admin.options.delete_view        admin:churches_zoneleadership_delete
/portal-a26e12/churches/zoneleadership/<path:object_id>/history/        django.contrib.admin.options.history_view      admin:churches_zoneleadership_history
/portal-a26e12/churches/zoneleadership/add/     django.contrib.admin.options.add_view   admin:churches_zoneleadership_add
/portal-a26e12/core/blog/       django.contrib.admin.options.changelist_view    admin:core_blog_changelist
/portal-a26e12/core/blog/<path:object_id>/      django.views.generic.base.RedirectView
/portal-a26e12/core/blog/<path:object_id>/change/       django.contrib.admin.options.change_view        admin:core_blog_change
/portal-a26e12/core/blog/<path:object_id>/delete/       django.contrib.admin.options.delete_view        admin:core_blog_delete
/portal-a26e12/core/blog/<path:object_id>/history/      django.contrib.admin.options.history_view       admin:core_blog_history
/portal-a26e12/core/blog/add/   django.contrib.admin.options.add_view   admin:core_blog_add
/portal-a26e12/core/documentation/      django.contrib.admin.options.changelist_view    admin:core_documentation_changelist
/portal-a26e12/core/documentation/<path:object_id>/     django.views.generic.base.RedirectView
/portal-a26e12/core/documentation/<path:object_id>/change/      django.contrib.admin.options.change_view        admin:core_documentation_change
/portal-a26e12/core/documentation/<path:object_id>/delete/      django.contrib.admin.options.delete_view        admin:core_documentation_delete
/portal-a26e12/core/documentation/<path:object_id>/history/     django.contrib.admin.options.history_view       admin:core_documentation_history
/portal-a26e12/core/documentation/add/  django.contrib.admin.options.add_view   admin:core_documentation_add
/portal-a26e12/core/tos/        django.contrib.admin.options.changelist_view    admin:core_tos_changelist
/portal-a26e12/core/tos/<path:object_id>/       django.views.generic.base.RedirectView
/portal-a26e12/core/tos/<path:object_id>/change/        django.contrib.admin.options.change_view        admin:core_tos_change
/portal-a26e12/core/tos/<path:object_id>/delete/        django.contrib.admin.options.delete_view        admin:core_tos_delete
/portal-a26e12/core/tos/<path:object_id>/history/       django.contrib.admin.options.history_view       admin:core_tos_history
/portal-a26e12/core/tos/add/    django.contrib.admin.options.add_view   admin:core_tos_add
/portal-a26e12/jsi18n/  django.contrib.admin.sites.i18n_javascript      admin:jsi18n
/portal-a26e12/login/   django.contrib.admin.sites.login        admin:login
/portal-a26e12/login_history/loginhistory/      django.contrib.admin.options.changelist_view    admin:login_history_loginhistory_changelist
/portal-a26e12/login_history/loginhistory/<path:object_id>/     django.views.generic.base.RedirectView
/portal-a26e12/login_history/loginhistory/<path:object_id>/change/      django.contrib.admin.options.change_view       admin:login_history_loginhistory_change
/portal-a26e12/login_history/loginhistory/<path:object_id>/delete/      django.contrib.admin.options.delete_view       admin:login_history_loginhistory_delete
/portal-a26e12/login_history/loginhistory/<path:object_id>/history/     django.contrib.admin.options.history_view      admin:login_history_loginhistory_history
/portal-a26e12/login_history/loginhistory/add/  django.contrib.admin.options.add_view   admin:login_history_loginhistory_add
/portal-a26e12/logout/  django.contrib.admin.sites.logout       admin:logout
/portal-a26e12/password_change/ django.contrib.admin.sites.password_change      admin:password_change
/portal-a26e12/password_change/done/    django.contrib.admin.sites.password_change_done admin:password_change_done
/portal-a26e12/people/attendance/       django.contrib.admin.options.changelist_view    admin:people_attendance_changelist
/portal-a26e12/people/attendance/<path:object_id>/      django.views.generic.base.RedirectView
/portal-a26e12/people/attendance/<path:object_id>/change/       django.contrib.admin.options.change_view        admin:people_attendance_change
/portal-a26e12/people/attendance/<path:object_id>/delete/       django.contrib.admin.options.delete_view        admin:people_attendance_delete
/portal-a26e12/people/attendance/<path:object_id>/history/      django.contrib.admin.options.history_view       admin:people_attendance_history
/portal-a26e12/people/attendance/add/   django.contrib.admin.options.add_view   admin:people_attendance_add
/portal-a26e12/people/homecell/ django.contrib.admin.options.changelist_view    admin:people_homecell_changelist
/portal-a26e12/people/homecell/<path:object_id>/        django.views.generic.base.RedirectView
/portal-a26e12/people/homecell/<path:object_id>/change/ django.contrib.admin.options.change_view        admin:people_homecell_change
/portal-a26e12/people/homecell/<path:object_id>/delete/ django.contrib.admin.options.delete_view        admin:people_homecell_delete
/portal-a26e12/people/homecell/<path:object_id>/history/        django.contrib.admin.options.history_view       admin:people_homecell_history
/portal-a26e12/people/homecell/add/     django.contrib.admin.options.add_view   admin:people_homecell_add
/portal-a26e12/people/juniormember/     django.contrib.admin.options.changelist_view    admin:people_juniormember_changelist
/portal-a26e12/people/juniormember/<path:object_id>/    django.views.generic.base.RedirectView
/portal-a26e12/people/juniormember/<path:object_id>/change/     django.contrib.admin.options.change_view        admin:people_juniormember_change
/portal-a26e12/people/juniormember/<path:object_id>/delete/     django.contrib.admin.options.delete_view        admin:people_juniormember_delete
/portal-a26e12/people/juniormember/<path:object_id>/history/    django.contrib.admin.options.history_view       admin:people_juniormember_history
/portal-a26e12/people/juniormember/add/ django.contrib.admin.options.add_view   admin:people_juniormember_add
/portal-a26e12/people/member/   django.contrib.admin.options.changelist_view    admin:people_member_changelist
/portal-a26e12/people/member/<path:object_id>/  django.views.generic.base.RedirectView
/portal-a26e12/people/member/<path:object_id>/change/   django.contrib.admin.options.change_view        admin:people_member_change
/portal-a26e12/people/member/<path:object_id>/delete/   django.contrib.admin.options.delete_view        admin:people_member_delete
/portal-a26e12/people/member/<path:object_id>/history/  django.contrib.admin.options.history_view       admin:people_member_history
/portal-a26e12/people/member/add/       django.contrib.admin.options.add_view   admin:people_member_add
/portal-a26e12/people/ministry/ django.contrib.admin.options.changelist_view    admin:people_ministry_changelist
/portal-a26e12/people/ministry/<path:object_id>/        django.views.generic.base.RedirectView
/portal-a26e12/people/ministry/<path:object_id>/change/ django.contrib.admin.options.change_view        admin:people_ministry_change
/portal-a26e12/people/ministry/<path:object_id>/delete/ django.contrib.admin.options.delete_view        admin:people_ministry_delete
/portal-a26e12/people/ministry/<path:object_id>/history/        django.contrib.admin.options.history_view       admin:people_ministry_history
/portal-a26e12/people/ministry/add/     django.contrib.admin.options.add_view   admin:people_ministry_add
/portal-a26e12/people/position/ django.contrib.admin.options.changelist_view    admin:people_position_changelist
/portal-a26e12/people/position/<path:object_id>/        django.views.generic.base.RedirectView
/portal-a26e12/people/position/<path:object_id>/change/ django.contrib.admin.options.change_view        admin:people_position_change
/portal-a26e12/people/position/<path:object_id>/delete/ django.contrib.admin.options.delete_view        admin:people_position_delete
/portal-a26e12/people/position/<path:object_id>/history/        django.contrib.admin.options.history_view       admin:people_position_history
/portal-a26e12/people/position/add/     django.contrib.admin.options.add_view   admin:people_position_add
/portal-a26e12/people/sundayschoolattendance/   django.contrib.admin.options.changelist_view    admin:people_sundayschoolattendance_changelist
/portal-a26e12/people/sundayschoolattendance/<path:object_id>/  django.views.generic.base.RedirectView
/portal-a26e12/people/sundayschoolattendance/<path:object_id>/change/   django.contrib.admin.options.change_view       admin:people_sundayschoolattendance_change
/portal-a26e12/people/sundayschoolattendance/<path:object_id>/delete/   django.contrib.admin.options.delete_view       admin:people_sundayschoolattendance_delete
/portal-a26e12/people/sundayschoolattendance/<path:object_id>/history/  django.contrib.admin.options.history_view      admin:people_sundayschoolattendance_history
/portal-a26e12/people/sundayschoolattendance/add/       django.contrib.admin.options.add_view   admin:people_sundayschoolattendance_add
/portal-a26e12/people/tally/    django.contrib.admin.options.changelist_view    admin:people_tally_changelist
/portal-a26e12/people/tally/<path:object_id>/   django.views.generic.base.RedirectView
/portal-a26e12/people/tally/<path:object_id>/change/    django.contrib.admin.options.change_view        admin:people_tally_change
/portal-a26e12/people/tally/<path:object_id>/delete/    django.contrib.admin.options.delete_view        admin:people_tally_delete
/portal-a26e12/people/tally/<path:object_id>/history/   django.contrib.admin.options.history_view       admin:people_tally_history
/portal-a26e12/people/tally/add/        django.contrib.admin.options.add_view   admin:people_tally_add
/portal-a26e12/posts/comment/   django.contrib.admin.options.changelist_view    admin:posts_comment_changelist
/portal-a26e12/posts/comment/<path:object_id>/  django.views.generic.base.RedirectView
/portal-a26e12/posts/comment/<path:object_id>/change/   django.contrib.admin.options.change_view        admin:posts_comment_change
/portal-a26e12/posts/comment/<path:object_id>/delete/   django.contrib.admin.options.delete_view        admin:posts_comment_delete
/portal-a26e12/posts/comment/<path:object_id>/history/  django.contrib.admin.options.history_view       admin:posts_comment_history
/portal-a26e12/posts/comment/add/       django.contrib.admin.options.add_view   admin:posts_comment_add
/portal-a26e12/posts/like/      django.contrib.admin.options.changelist_view    admin:posts_like_changelist
/portal-a26e12/posts/like/<path:object_id>/     django.views.generic.base.RedirectView
/portal-a26e12/posts/like/<path:object_id>/change/      django.contrib.admin.options.change_view        admin:posts_like_change
/portal-a26e12/posts/like/<path:object_id>/delete/      django.contrib.admin.options.delete_view        admin:posts_like_delete
/portal-a26e12/posts/like/<path:object_id>/history/     django.contrib.admin.options.history_view       admin:posts_like_history
/portal-a26e12/posts/like/add/  django.contrib.admin.options.add_view   admin:posts_like_add
/portal-a26e12/posts/post/      django.contrib.admin.options.changelist_view    admin:posts_post_changelist
/portal-a26e12/posts/post/<path:object_id>/     django.views.generic.base.RedirectView
/portal-a26e12/posts/post/<path:object_id>/change/      django.contrib.admin.options.change_view        admin:posts_post_change
/portal-a26e12/posts/post/<path:object_id>/delete/      django.contrib.admin.options.delete_view        admin:posts_post_delete
/portal-a26e12/posts/post/<path:object_id>/history/     django.contrib.admin.options.history_view       admin:posts_post_history
/portal-a26e12/posts/post/add/  django.contrib.admin.options.add_view   admin:posts_post_add
/portal-a26e12/posts/postimage/ django.contrib.admin.options.changelist_view    admin:posts_postimage_changelist
/portal-a26e12/posts/postimage/<path:object_id>/        django.views.generic.base.RedirectView
/portal-a26e12/posts/postimage/<path:object_id>/change/ django.contrib.admin.options.change_view        admin:posts_postimage_change
/portal-a26e12/posts/postimage/<path:object_id>/delete/ django.contrib.admin.options.delete_view        admin:posts_postimage_delete
/portal-a26e12/posts/postimage/<path:object_id>/history/        django.contrib.admin.options.history_view       admin:posts_postimage_history
/portal-a26e12/posts/postimage/add/     django.contrib.admin.options.add_view   admin:posts_postimage_add
/portal-a26e12/projects/project/        django.contrib.admin.options.changelist_view    admin:projects_project_changelist
/portal-a26e12/projects/project/<path:object_id>/       django.views.generic.base.RedirectView
/portal-a26e12/projects/project/<path:object_id>/change/        django.contrib.admin.options.change_view        admin:projects_project_change
/portal-a26e12/projects/project/<path:object_id>/delete/        django.contrib.admin.options.delete_view        admin:projects_project_delete
/portal-a26e12/projects/project/<path:object_id>/history/       django.contrib.admin.options.history_view       admin:projects_project_history
/portal-a26e12/projects/project/add/    django.contrib.admin.options.add_view   admin:projects_project_add
/portal-a26e12/r/<path:content_type_id>/<path:object_id>/       django.contrib.contenttypes.views.shortcut      admin:view_on_site
/portal-a26e12/reports/assemblyreport/  django.contrib.admin.options.changelist_view    admin:reports_assemblyreport_changelist
/portal-a26e12/reports/assemblyreport/<path:object_id>/ django.views.generic.base.RedirectView
/portal-a26e12/reports/assemblyreport/<path:object_id>/change/  django.contrib.admin.options.change_view        admin:reports_assemblyreport_change
/portal-a26e12/reports/assemblyreport/<path:object_id>/delete/  django.contrib.admin.options.delete_view        admin:reports_assemblyreport_delete
/portal-a26e12/reports/assemblyreport/<path:object_id>/history/ django.contrib.admin.options.history_view       admin:reports_assemblyreport_history
/portal-a26e12/reports/assemblyreport/add/      django.contrib.admin.options.add_view   admin:reports_assemblyreport_add
/portal-a26e12/reports/auditlog/        django.contrib.admin.options.changelist_view    admin:reports_auditlog_changelist
/portal-a26e12/reports/auditlog/<path:object_id>/       django.views.generic.base.RedirectView
/portal-a26e12/reports/auditlog/<path:object_id>/change/        django.contrib.admin.options.change_view        admin:reports_auditlog_change
/portal-a26e12/reports/auditlog/<path:object_id>/delete/        django.contrib.admin.options.delete_view        admin:reports_auditlog_delete
/portal-a26e12/reports/auditlog/<path:object_id>/history/       django.contrib.admin.options.history_view       admin:reports_auditlog_history
/portal-a26e12/reports/auditlog/add/    django.contrib.admin.options.add_view   admin:reports_auditlog_add
/portal-a26e12/reports/reportrejection/ django.contrib.admin.options.changelist_view    admin:reports_reportrejection_changelist
/portal-a26e12/reports/reportrejection/<path:object_id>/        django.views.generic.base.RedirectView
/portal-a26e12/reports/reportrejection/<path:object_id>/change/ django.contrib.admin.options.change_view        admin:reports_reportrejection_change
/portal-a26e12/reports/reportrejection/<path:object_id>/delete/ django.contrib.admin.options.delete_view        admin:reports_reportrejection_delete
/portal-a26e12/reports/reportrejection/<path:object_id>/history/        django.contrib.admin.options.history_view      admin:reports_reportrejection_history
/portal-a26e12/reports/reportrejection/add/     django.contrib.admin.options.add_view   admin:reports_reportrejection_add
/portal-a26e12/reports/reportsectionstatus/     django.contrib.admin.options.changelist_view    admin:reports_reportsectionstatus_changelist
/portal-a26e12/reports/reportsectionstatus/<path:object_id>/    django.views.generic.base.RedirectView
/portal-a26e12/reports/reportsectionstatus/<path:object_id>/change/     django.contrib.admin.options.change_view       admin:reports_reportsectionstatus_change
/portal-a26e12/reports/reportsectionstatus/<path:object_id>/delete/     django.contrib.admin.options.delete_view       admin:reports_reportsectionstatus_delete
/portal-a26e12/reports/reportsectionstatus/<path:object_id>/history/    django.contrib.admin.options.history_view      admin:reports_reportsectionstatus_history
/portal-a26e12/reports/reportsectionstatus/add/ django.contrib.admin.options.add_view   admin:reports_reportsectionstatus_add
/portal-a26e12/strategic/strategy/      django.contrib.admin.options.changelist_view    admin:strategic_strategy_changelist
/portal-a26e12/strategic/strategy/<path:object_id>/     django.views.generic.base.RedirectView
/portal-a26e12/strategic/strategy/<path:object_id>/change/      django.contrib.admin.options.change_view        admin:strategic_strategy_change
/portal-a26e12/strategic/strategy/<path:object_id>/delete/      django.contrib.admin.options.delete_view        admin:strategic_strategy_delete
/portal-a26e12/strategic/strategy/<path:object_id>/history/     django.contrib.admin.options.history_view       admin:strategic_strategy_history
/portal-a26e12/strategic/strategy/add/  django.contrib.admin.options.add_view   admin:strategic_strategy_add
/portal-a26e12/strategic/strategylegacy/        django.contrib.admin.options.changelist_view    admin:strategic_strategylegacy_changelist
/portal-a26e12/strategic/strategylegacy/<path:object_id>/       django.views.generic.base.RedirectView
/portal-a26e12/strategic/strategylegacy/<path:object_id>/change/        django.contrib.admin.options.change_view       admin:strategic_strategylegacy_change
/portal-a26e12/strategic/strategylegacy/<path:object_id>/delete/        django.contrib.admin.options.delete_view       admin:strategic_strategylegacy_delete
/portal-a26e12/strategic/strategylegacy/<path:object_id>/history/       django.contrib.admin.options.history_view      admin:strategic_strategylegacy_history
/portal-a26e12/strategic/strategylegacy/add/    django.contrib.admin.options.add_view   admin:strategic_strategylegacy_add
/portal-a26e12/token_blacklist/blacklistedtoken/        django.contrib.admin.options.changelist_view    admin:token_blacklist_blacklistedtoken_changelist
/portal-a26e12/token_blacklist/blacklistedtoken/<path:object_id>/       django.views.generic.base.RedirectView
/portal-a26e12/token_blacklist/blacklistedtoken/<path:object_id>/change/        django.contrib.admin.options.change_viewadmin:token_blacklist_blacklistedtoken_change
/portal-a26e12/token_blacklist/blacklistedtoken/<path:object_id>/delete/        django.contrib.admin.options.delete_viewadmin:token_blacklist_blacklistedtoken_delete
/portal-a26e12/token_blacklist/blacklistedtoken/<path:object_id>/history/       django.contrib.admin.options.history_view       admin:token_blacklist_blacklistedtoken_history
/portal-a26e12/token_blacklist/blacklistedtoken/add/    django.contrib.admin.options.add_view   admin:token_blacklist_blacklistedtoken_add
/portal-a26e12/token_blacklist/outstandingtoken/        django.contrib.admin.options.changelist_view    admin:token_blacklist_outstandingtoken_changelist
/portal-a26e12/token_blacklist/outstandingtoken/<path:object_id>/       django.views.generic.base.RedirectView
/portal-a26e12/token_blacklist/outstandingtoken/<path:object_id>/change/        django.contrib.admin.options.change_viewadmin:token_blacklist_outstandingtoken_change
/portal-a26e12/token_blacklist/outstandingtoken/<path:object_id>/delete/        django.contrib.admin.options.delete_viewadmin:token_blacklist_outstandingtoken_delete
/portal-a26e12/token_blacklist/outstandingtoken/<path:object_id>/history/       django.contrib.admin.options.history_view       admin:token_blacklist_outstandingtoken_history
/portal-a26e12/token_blacklist/outstandingtoken/add/    django.contrib.admin.options.add_view   admin:token_blacklist_outstandingtoken_add
/portal-a26e12/uploads/uploaderror/     django.contrib.admin.options.changelist_view    admin:uploads_uploaderror_changelist
/portal-a26e12/uploads/uploaderror/<path:object_id>/    django.views.generic.base.RedirectView
/portal-a26e12/uploads/uploaderror/<path:object_id>/change/     django.contrib.admin.options.change_view        admin:uploads_uploaderror_change
/portal-a26e12/uploads/uploaderror/<path:object_id>/delete/     django.contrib.admin.options.delete_view        admin:uploads_uploaderror_delete
/portal-a26e12/uploads/uploaderror/<path:object_id>/history/    django.contrib.admin.options.history_view       admin:uploads_uploaderror_history
/portal-a26e12/uploads/uploaderror/add/ django.contrib.admin.options.add_view   admin:uploads_uploaderror_add
/portal-a26e12/uploads/uploadsession/   django.contrib.admin.options.changelist_view    admin:uploads_uploadsession_changelist
/portal-a26e12/uploads/uploadsession/<path:object_id>/  django.views.generic.base.RedirectView
/portal-a26e12/uploads/uploadsession/<path:object_id>/change/   django.contrib.admin.options.change_view        admin:uploads_uploadsession_change
/portal-a26e12/uploads/uploadsession/<path:object_id>/delete/   django.contrib.admin.options.delete_view        admin:uploads_uploadsession_delete
/portal-a26e12/uploads/uploadsession/<path:object_id>/history/  django.contrib.admin.options.history_view       admin:uploads_uploadsession_history
/portal-a26e12/uploads/uploadsession/add/       django.contrib.admin.options.add_view   admin:uploads_uploadsession_add
/portal-a26e12/users/authhistory/       django.contrib.admin.options.changelist_view    admin:users_authhistory_changelist
/portal-a26e12/users/authhistory/<path:object_id>/      django.views.generic.base.RedirectView
/portal-a26e12/users/authhistory/<path:object_id>/change/       django.contrib.admin.options.change_view        admin:users_authhistory_change
/portal-a26e12/users/authhistory/<path:object_id>/delete/       django.contrib.admin.options.delete_view        admin:users_authhistory_delete
/portal-a26e12/users/authhistory/<path:object_id>/history/      django.contrib.admin.options.history_view       admin:users_authhistory_history
/portal-a26e12/users/authhistory/add/   django.contrib.admin.options.add_view   admin:users_authhistory_add
/portal-a26e12/users/delegatepermission/        django.contrib.admin.options.changelist_view    admin:users_delegatepermission_changelist
/portal-a26e12/users/delegatepermission/<path:object_id>/       django.views.generic.base.RedirectView
/portal-a26e12/users/delegatepermission/<path:object_id>/change/        django.contrib.admin.options.change_view       admin:users_delegatepermission_change
/portal-a26e12/users/delegatepermission/<path:object_id>/delete/        django.contrib.admin.options.delete_view       admin:users_delegatepermission_delete
/portal-a26e12/users/delegatepermission/<path:object_id>/history/       django.contrib.admin.options.history_view      admin:users_delegatepermission_history
/portal-a26e12/users/delegatepermission/add/    django.contrib.admin.options.add_view   admin:users_delegatepermission_add
/portal-a26e12/users/profile/   django.contrib.admin.options.changelist_view    admin:users_profile_changelist
/portal-a26e12/users/profile/<path:object_id>/  django.views.generic.base.RedirectView
/portal-a26e12/users/profile/<path:object_id>/change/   django.contrib.admin.options.change_view        admin:users_profile_change
/portal-a26e12/users/profile/<path:object_id>/delete/   django.contrib.admin.options.delete_view        admin:users_profile_delete
/portal-a26e12/users/profile/<path:object_id>/history/  django.contrib.admin.options.history_view       admin:users_profile_history
/portal-a26e12/users/profile/add/       django.contrib.admin.options.add_view   admin:users_profile_add
/portal-a26e12/users/role/      django.contrib.admin.options.changelist_view    admin:users_role_changelist
/portal-a26e12/users/role/<path:object_id>/     django.views.generic.base.RedirectView
/portal-a26e12/users/role/<path:object_id>/change/      django.contrib.admin.options.change_view        admin:users_role_change
/portal-a26e12/users/role/<path:object_id>/delete/      django.contrib.admin.options.delete_view        admin:users_role_delete
/portal-a26e12/users/role/<path:object_id>/history/     django.contrib.admin.options.history_view       admin:users_role_history
/portal-a26e12/users/role/add/  django.contrib.admin.options.add_view   admin:users_role_add
/portal-a26e12/users/user/      django.contrib.admin.options.changelist_view    admin:users_user_changelist
/portal-a26e12/users/user/<id>/password/        django.contrib.auth.admin.user_change_password  admin:auth_user_password_change
/portal-a26e12/users/user/<path:object_id>/     django.views.generic.base.RedirectView
/portal-a26e12/users/user/<path:object_id>/change/      django.contrib.admin.options.change_view        admin:users_user_change
/portal-a26e12/users/user/<path:object_id>/delete/      django.contrib.admin.options.delete_view        admin:users_user_delete
/portal-a26e12/users/user/<path:object_id>/history/     django.contrib.admin.options.history_view       admin:users_user_history
/portal-a26e12/users/user/add/  django.contrib.auth.admin.add_view      admin:users_user_add
/static/<path>  django.views.static.serve