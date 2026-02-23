
export enum ProjectPhase {
  PRE_CLINICAL = 'Pre-Clinical',
  PHASE_1 = 'Phase 1',
  PHASE_2 = 'Phase 2',
  PHASE_3 = 'Phase 3',
  SUBMISSION = 'Submission',
  LAUNCHED = 'Launched'
}

export enum InnovationCategory {
  FORMULATION = 'Formulation',
  INDICATION_EXPANSION = 'Indication Expansion',
  LIFECYCLE = 'Lifecycle',
  ACCESS = 'Access',
  DEVICE = 'Device',
  DIGITAL = 'Digital'
}

export enum ImpactLevel {
  COMMERCIAL = 'Commercial',
  PATIENT = 'Patient',
  CLINICAL = 'Clinical',
  OPERATIONAL = 'Operational'
}

export enum TimeHorizon {
  NEAR = 'Near Term',
  MID = 'Mid Term',
  LONG = 'Long Term'
}

export enum InnovationStatus {
  IDEA = 'Idea',
  UNDER_EVALUATION = 'Under Evaluation',
  IN_PLAN = 'In Plan',
  DEPRIORITIZED = 'Deprioritized'
}

export interface AIPProject {
  id: string;
  name: string;
  asset: string;
  therapeuticArea: string;
  phase: ProjectPhase;
  targetDate: string;
  sharepointUrl: string;
  region?: string;
  taggedDocuments: {
    lrfp: boolean;
    tpp: boolean;
    cdp: boolean;
  };
}

export interface Innovation {
  id: string;
  projectId: string;
  title: string;
  description: string;
  category: InnovationCategory;
  impactLevel: ImpactLevel;
  timeHorizon: TimeHorizon;
  status: InnovationStatus;
  createdAt: string;
  createdBy: string;
  startDate?: string;
  endDate?: string;
}

export interface Milestone {
  id: string;
  title: string;
  date: string;
  status: 'Completed' | 'In Progress' | 'Planned' | 'Risk';
  owner: string;
  description?: string;
}

export interface LaunchPlan {
  projectId: string;
  region: string;
  targetLaunchDate: string;
  milestones: Milestone[];
}

export enum UserRole {
  ADMIN = 'admin',
  PLANNER = 'planner',
  LAUNCHER = 'launcher'
}

export interface User {
  username: string;
  role: UserRole;
  name: string;
}
