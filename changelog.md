# Changelog

All notable changes to OpenRisk will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Planned
- Multi-tenant support
- Mobile app (React Native)
- Slack/Teams notifications
- Jira integration

## [1.0.4] - 2025-01-02

### Added
- Analytics dashboard with real-time risk metrics
- Gamification system with badges and progress tracking
- Custom fields framework (5 field types supported)
- Bulk operations for risks and mitigations
- Advanced search and filtering capabilities
- Risk timeline view (audit trail)

### Improved
- Dashboard load time reduced by 40%
- Mobile responsive design across all pages
- API response times optimized
- Documentation structure reorganized

### Fixed
- API token expiration edge cases
- Search filter bugs with special characters
- Session handling on token refresh
- Mobile menu navigation issues

## [1.0.3] - 2024-12-15

### Added
- OAuth2/SAML2 SSO support (Google, GitHub, Azure AD)
- Role-Based Access Control (RBAC)
- API token management (create, revoke, rotate)
- Comprehensive audit logging

### Improved
- Authentication flow security
- Permission matrix granularity
- Database query optimization

### Fixed
- JWT token refresh bugs
- Permission check edge cases

## [1.0.2] - 2024-12-01

### Added
- Mitigation sub-actions (checklist items)
- Asset relationship management
- Risk scoring engine improvements

### Fixed
- Soft-delete cascade issues
- Asset linking bugs

## [1.0.1] - 2024-11-15

### Added
- Basic CRUD for risks, mitigations, assets
- Initial dashboard
- Documentation structure

## [1.0.0] - 2024-11-01

### Added
- Initial release
- Core risk management features
- React frontend + Go backend
- Docker Compose setup
- Basic authentication

---

[Unreleased]: https://github.com/opendefender/OpenRisk/compare/1.0.4...HEAD
[1.0.4]: https://github.com/opendefender/OpenRisk/compare/1.0.3...1.0.4
[1.0.3]: https://github.com/opendefender/OpenRisk/compare/1.0.2...1.0.3
