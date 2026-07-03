export interface AppTheme {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  headerFont: string;
  accentColor: string;
  borderStyle: string;
}

export interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
}

export interface GraphEdge {
  from: string;
  to: string;
  weight?: number;
  directed?: boolean;
}

export interface GraphStructure {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface Definition {
  term: string;
  definition: string;
  formula?: string;
  latex?: string;
  exampleText?: string;
  graph?: GraphStructure;
}

export interface SolvedExample {
  title: string;
  question: string;
  graph?: GraphStructure;
  solution: string[];
  answer: string;
}

export interface NoteSection {
  id: string;
  part: number;
  title: string;
  description: string;
  definitions: Definition[];
  theorems: {
    name: string;
    statement: string;
    formula?: string;
    explanation?: string;
  }[];
  solvedExamples: SolvedExample[];
  commonMistakes: string[];
  examTips: string[];
  universityQuestions: {
    type: 'Theory' | 'Numerical';
    question: string;
  }[];
}

export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}
