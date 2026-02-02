# OpenRisk Risk Management Operating System
## ISO 31000 and NIST RMF Compliant Implementation

Last Updated: February 2, 2026

## Executive Summary

OpenRisk has been extended to function as a comprehensive Risk Management Operating System (RMOS) that fully implements the ISO 31000 risk management framework and NIST Risk Management Framework (RMF) lifecycle. The system provides complete traceability, audit-ready reporting, and governance-aligned workflows for enterprise risk management.

## System Architecture

### Core Components

1. **Risk Management Policy Module**
   - Governance framework selection (ISO31000, NISTRMF, or both)
   - Risk appetite and tolerance definitions
   - Roles and responsibilities mapping
   - Approval chain workflows
   - Policy versioning and review cycles

2. **Risk Register (Extended)**
   - Complete ISO 31000 lifecycle tracking
   - Risk categorization (Strategic, Operational, Financial, Compliance, Reputational)
   - Context-aware identification
   - Multi-methodology analysis support
   - Ownership and accountability tracking

3. **Risk Treatment Planning**
   - Five treatment strategies: Mitigate, Avoid, Transfer, Accept, Enhance
   - Detailed action planning with dependencies
   - Resource allocation and budget tracking
   - Approval workflows
   - Effectiveness monitoring

4. **Risk Monitoring and Review**
   - Routine and exceptional review triggers
   - Trend identification and analysis
   - Treatment effectiveness assessment
   - Escalation management
   - Continuous improvement tracking

5. **Decision Management**
   - Full decision traceability
   - Decision rationale documentation
   - Risk acceptance terms and validity periods
   - Decision approval workflows
   - Related decision linking

6. **Audit and Compliance**
   - Audit-ready report generation
   - Framework compliance mapping (ISO27001, NIST, PCI-DSS, HIPAA, GDPR)
   - Complete change log and evidence tracking
   - Compliance evidence storage and verification
   - Sign-off workflows

## ISO 31000 Lifecycle Phases Implementation

### Phase 1: Risk Identification (IDENTIFY)

Endpoint: POST /api/v1/risk-management/identify

Captures:
- Risk identification date and method (Workshop, Interview, Assessment, Scanning, Manual)
- Risk category classification
- Business context and environment
- Identified by user with full audit trail

Database Tables:
- risk_register.identification_date
- risk_register.identified_by
- risk_register.identification_method
- risk_register.risk_category
- risk_register.risk_context

### Phase 2: Risk Analysis (ANALYZE)

Endpoint: POST /api/v1/risk-management/analyze

Performs:
- Probability scoring (1-5 scale)
- Impact scoring (1-5 scale)
- Risk score calculation (probability * impact)
- Root cause analysis
- Affected areas identification
- Analysis methodology documentation
- Inherent risk level determination

Automatic calculations:
- Risk Score = Probability * Impact
- Inherent Risk Level mapping:
  * LOW: Score <= 5
  * MEDIUM: Score 6-12
  * HIGH: Score 13-19
  * CRITICAL: Score >= 20

Database Tables:
- risk_register.analysis_date
- risk_register.probability_score
- risk_register.impact_score
- risk_register.risk_score
- risk_register.analysis_methodology
- risk_register.root_causes
- risk_register.affected_areas
- risk_register.inherent_risk_level

### Phase 3: Risk Evaluation (EVALUATE)

Endpoint: POST /api/v1/risk-management/evaluate

Determines:
- Risk priority (1-100 scale)
- Evaluation criteria applied
- Residual risk level assessment
- Risk prioritization for treatment

Database Tables:
- risk_register.evaluation_date
- risk_register.risk_priority
- risk_register.evaluation_criteria
- risk_register.residual_risk_level
- risk_register.evaluated_by

### Phase 4: Risk Treatment (TREAT)

Endpoint: POST /api/v1/risk-management/treatment-plans

Treatment Options:
- MITIGATE: Reduce probability or impact
- AVOID: Eliminate risk-causing activity
- TRANSFER: Shift risk to third party
- ACCEPT: Accept risk consciously
- ENHANCE: Improve opportunity

Includes:
- Treatment strategy definition
- Implementation timeline
- Budget allocation
- Resource assignment
- Approval workflows
- Review frequency scheduling

Sub-endpoint: POST /api/v1/risk-management/treatment-plans/:id/actions

Individual Actions:
- Action name and description
- Owner assignment
- Due date setting
- Priority levels (Low, Medium, High, Critical)
- Completion evidence tracking
- Dependency management

Database Tables:
- risk_treatment_plans (treatment strategy level)
- risk_treatment_actions (granular action items)

### Phase 5 & 6: Monitor and Review (MONITOR_REVIEW)

Endpoint: POST /api/v1/risk-management/monitoring-reviews

Monitors:
- Current probability and impact scores
- Current risk level
- Treatment effectiveness assessment
- Trend identification
- Emerging issues
- Escalation triggers
- Next review date scheduling

Review Types:
- ROUTINE: Regular scheduled reviews
- EXCEPTIONAL: Triggered by events
- QUARTERLY: Quarterly reviews
- ANNUAL: Annual reviews

Database Tables:
- risk_monitoring_reviews

## Decision Traceability

Endpoint: POST /api/v1/risk-management/decisions

Records:
- Decision type (Risk Acceptance, Treatment Selection, Escalation, Closure)
- Decision maker and role
- Decision date and time
- Rationale for decision
- Risk factors considered
- Alternatives evaluated
- Supporting evidence links
- Related decisions

Approval Workflow:
Endpoint: POST /api/v1/risk-management/decisions/:id/approve

Updates decision status from PROPOSED to APPROVED with approver tracking.

Database Tables:
- risk_decisions

## Audit-Ready Reporting

Endpoint: POST /api/v1/risk-management/audit-reports

Generates:
- ISO 31000 Compliance Reports
- NIST RMF Reports
- Executive Summaries
- Detailed Risk Registers
- Treatment Status Reports

Reports Include:
- Executive summary
- Key findings
- Metrics and analytics
- Risk inventory by status
- Risk inventory by severity
- Treatment completion status
- Treatment overdue items
- Risk snapshots at reporting time
- Decision history
- Policy changes during period
- Compliance status by framework

Sign-off Workflow:
- Report review
- Reviewer comments
- Final sign-off by authorized person
- Sign-off date and time

Database Tables:
- risk_audit_reports
- risk_compliance_evidence

## Complete Change Log and Audit Trail

Database Table: risk_change_log

Tracks:
- Entity type (Risk Register, Treatment Plan, Decision, Meeting Minutes)
- Entity ID
- Change type (CREATE, UPDATE, DELETE, STATUS_CHANGE, APPROVE, REJECT)
- Changed by (user ID)
- Changed at (timestamp)
- Field name (for updates)
- Old value and new value
- Reason for change
- Approval requirement
- Approved by

Complete historical record for all risk management activities ensuring compliance with auditing requirements.

## Meeting Minutes Integration

Database Table: risk_meeting_minutes

Captures:
- Meeting title and type (Risk Review, Steering Committee, Incident Review, Audit)
- Meeting date and facilitator
- Attendees list with roles
- Agenda items
- Summary of discussions
- Key decisions made
- Action items assigned with owners and due dates
- Risks discussed (linked to risk IDs)
- New risks identified in meeting
- Escalations noted
- Approval and distribution

## Compliance Framework Mappings

Supported Frameworks:
- ISO 27001: Information Security
- ISO 31000: Risk Management
- NIST RMF: Risk Management Framework
- PCI-DSS: Payment Card Industry
- HIPAA: Healthcare Privacy
- GDPR: Data Protection
- CIS Controls: Security Controls
- OWASP: Web Application Security

Each risk can be tagged with applicable frameworks for:
- Requirement tracing
- Evidence collection
- Compliance reporting
- Audit preparation

Database Tables:
- risk_register.compliance_frameworks
- risk_compliance_evidence.compliance_framework

## API Endpoints Summary

Risk Lifecycle Management:

POST /api/v1/risk-management/identify
- Identify new risk

POST /api/v1/risk-management/analyze
- Analyze identified risk

POST /api/v1/risk-management/evaluate
- Evaluate risk

POST /api/v1/risk-management/treatment-plans
- Create treatment plan

POST /api/v1/risk-management/treatment-plans/:id/actions
- Add action to treatment plan

POST /api/v1/risk-management/monitoring-reviews
- Create monitoring review

POST /api/v1/risk-management/decisions
- Record risk decision

POST /api/v1/risk-management/decisions/:id/approve
- Approve recorded decision

POST /api/v1/risk-management/audit-reports
- Generate audit-ready report

GET /api/v1/risk-management/risks/:id/lifecycle-status
- Get complete lifecycle status

## Database Schema

Total Tables Created: 10

1. risk_management_policies - Policy governance
2. risk_register - Core risk tracking with ISO 31000 phases
3. risk_treatment_plans - Treatment strategies
4. risk_treatment_actions - Individual action items
5. risk_monitoring_reviews - Monitoring and review records
6. risk_decisions - Decision traceability
7. risk_meeting_minutes - Meeting records
8. risk_audit_reports - Audit-ready reports
9. risk_change_log - Complete audit trail
10. risk_compliance_evidence - Compliance evidence storage

## Key Features

1. Full ISO 31000 Lifecycle Traceability
   - Every phase tracked from identification to review
   - Status progression with audit trail
   - Phase completion validation

2. NIST RMF Alignment
   - Risk assessment component
   - Risk response planning
   - Risk monitoring and control
   - Categorical Risk Model support

3. Audit and Compliance Ready
   - Exportable evidence for auditors
   - Framework-aligned reporting
   - Complete change history
   - Sign-off workflows

4. Enterprise Governance
   - Approval workflows
   - Role-based access control
   - Policy versioning
   - Authority-based decision making

5. Continuous Monitoring
   - Scheduled reviews
   - Exceptional review triggers
   - Trend analysis
   - Effectiveness assessment

6. Decision Documentation
   - Rationale capture
   - Alternative analysis
   - Risk factors considered
   - Supporting evidence links

7. Complete Traceability
   - Who changed what, when, and why
   - Decision maker accountability
   - Risk owner responsibility
   - Audit trail immutability

## Implementation Notes

Backend Technology:
- Language: Go 1.25.4
- Framework: Fiber v2.52
- Database: PostgreSQL with UUID primary keys
- ORM: GORM v1.31
- Validation: go-playground/validator

Frontend Ready:
- Handlers prepared for React integration
- RESTful JSON APIs
- Standard error handling
- Comprehensive input validation

## Compliance Checklist

ISO 31000 Requirements:
- Risk identification: Implemented
- Risk analysis: Implemented
- Risk evaluation: Implemented
- Risk treatment: Implemented
- Monitoring and review: Implemented
- Communication and consultation: Meeting minutes module
- Recording and reporting: Audit report generation
- Framework governance: Policy module

NIST RMF Requirements:
- Categorization: Risk categorization in register
- Asset identification: Linked to existing risk assets
- Risk assessment: Analysis phase
- Risk response: Treatment planning
- Risk monitoring: Monitoring review phase
- Authorization: Approval workflows
- Accountability: Complete audit trail

## Future Enhancements

- Risk heat map visualization
- Scenario analysis tools
- Risk trend forecasting
- Automated escalation triggers
- Integration with incident management
- Risk correlation analysis
- Dashboard analytics
- Custom metric definitions

## Migration Instructions

To enable Risk Management System:

1. Run migration 0013:
   sudo -u postgres psql openrisk < database/0013_risk_management_system.sql

2. Restart backend service
3. Rebuild frontend components
4. Update API client to use new endpoints
5. Configure risk management policies
6. Assign risk owners and stakeholders

## Support and Documentation

Full OpenRisk Risk Management System documentation is available in:
- RISK_MANAGEMENT_FRAMEWORK_ISO31000_NIST.md
- API endpoint specifications in handlers
- Database schema in migrations

For questions or support, refer to the comprehensive schema documentation and handler implementations.
