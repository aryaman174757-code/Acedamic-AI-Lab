import { NoteSection, QuizQuestion } from '../types';

export const notesData: NoteSection[] = [
  {
    id: 'part1',
    part: 1,
    title: 'Introduction to Graph Theory',
    description: 'Core concepts of graphs, vertices, edges, basic graph types, and structural measurements.',
    definitions: [
      {
        term: 'Graph Theory',
        definition: 'The branch of mathematics studying graphs, which are mathematical structures used to model pairwise relations between objects.',
        exampleText: 'Used to model connections in social networks, computer networks, and navigation systems.'
      },
      {
        term: 'Graph',
        definition: 'A collection of vertices (nodes) and edges (links) connecting those vertices. Mathematically represented as G = (V, E).',
        formula: 'G = (V, E)',
        exampleText: 'For V = {A, B, C, D} and E = {AB, AC, BC, CD}, the graph forms a connected structure with a diagonal edge.',
        graph: {
          nodes: [
            { id: 'A', label: 'A', x: 100, y: 30 },
            { id: 'B', label: 'B', x: 40, y: 110 },
            { id: 'C', label: 'C', x: 160, y: 110 },
            { id: 'D', label: 'D', x: 100, y: 180 }
          ],
          edges: [
            { from: 'A', to: 'B' },
            { from: 'A', to: 'C' },
            { from: 'B', to: 'C' },
            { from: 'C', to: 'D' }
          ]
        }
      },
      {
        term: 'Order of a Graph',
        definition: 'The total number of vertices in a graph G, denoted as |V|.',
        formula: '|V|',
        exampleText: 'If a graph has vertices {A, B, C, D, E}, then its Order |V| is 5.'
      },
      {
        term: 'Size of a Graph',
        definition: 'The total number of edges in a graph G, denoted as |E|.',
        formula: '|E|',
        exampleText: 'If a graph has edges {AB, AC, AD, BC, CD}, then its Size |E| is 5.'
      },
      {
        term: 'Simple Graph',
        definition: 'A graph that contains no self-loops (edges from a vertex to itself) and no multiple edges (parallel edges between the same two vertices).',
        exampleText: 'A basic square grid of vertices is a simple graph.',
        graph: {
          nodes: [
            { id: 'A', label: 'A', x: 50, y: 50 },
            { id: 'B', label: 'B', x: 150, y: 50 },
            { id: 'C', label: 'C', x: 150, y: 150 },
            { id: 'D', label: 'D', x: 50, y: 150 }
          ],
          edges: [
            { from: 'A', to: 'B' },
            { from: 'B', to: 'C' },
            { from: 'C', to: 'D' },
            { from: 'D', to: 'A' }
          ]
        }
      },
      {
        term: 'Multigraph',
        definition: 'A graph that contains multiple (parallel) edges between the same pair of vertices, but no self-loops.',
        exampleText: 'Two cities connected by multiple alternative roads.',
        graph: {
          nodes: [
            { id: 'A', label: 'A', x: 60, y: 100 },
            { id: 'B', label: 'B', x: 190, y: 100 }
          ],
          edges: [
            { from: 'A', to: 'B' },
            { from: 'A', to: 'B' } // Parallel edge
          ]
        }
      },
      {
        term: 'Pseudograph',
        definition: 'A graph that contains both self-loops and multiple (parallel) edges.',
        exampleText: 'A network diagram where a device can route packets back to itself.',
        graph: {
          nodes: [
            { id: 'A', label: 'A', x: 100, y: 100 }
          ],
          edges: [
            { from: 'A', to: 'A' } // Loop
          ]
        }
      },
      {
        term: 'Null Graph',
        definition: 'A graph that contains vertices but absolutely no edges. |E| = 0.',
        exampleText: 'Isolated points with no connections.',
        graph: {
          nodes: [
            { id: 'A', label: 'A', x: 50, y: 100 },
            { id: 'B', label: 'B', x: 100, y: 100 },
            { id: 'C', label: 'C', x: 150, y: 100 },
            { id: 'D', label: 'D', x: 200, y: 100 }
          ],
          edges: []
        }
      },
      {
        term: 'Trivial Graph',
        definition: 'A graph containing exactly one vertex and no edges. |V| = 1 and |E| = 0.',
        exampleText: 'A single point representing a system starter.',
        graph: {
          nodes: [
            { id: 'A', label: 'A', x: 125, y: 100 }
          ],
          edges: []
        }
      },
      {
        term: 'Adjacent Vertices',
        definition: 'Two vertices that are directly connected by an edge in the graph.',
        exampleText: 'In a triangle graph ABC, A is adjacent to B and C, but in a line A-B-C, A and C are not adjacent.'
      },
      {
        term: 'Incident Edge',
        definition: 'An edge is said to be incident on the vertices that it directly connects.',
        exampleText: 'For edge AB, it is incident on both vertex A and vertex B.'
      }
    ],
    theorems: [],
    solvedExamples: [
      {
        title: 'Example 1: Order & Size Calculation',
        question: 'Find the order and size of a graph with V = {A, B, C, D, E} and E = {AB, AC, BC, CD, DE}.',
        solution: [
          'Step 1: Write down the set of vertices and count its elements.',
          '|V| = Count({A, B, C, D, E}) = 5. Therefore, the Order is 5.',
          'Step 2: Write down the set of edges and count its elements.',
          '|E| = Count({AB, AC, BC, CD, DE}) = 5. Therefore, the Size is 5.'
        ],
        answer: 'Order |V| = 5, Size |E| = 5'
      },
      {
        title: 'Example 2: Degree of Vertices in a Star Graph',
        question: 'Calculate the degree of each vertex in a graph G where a central vertex C is connected to A, B, D, and E.',
        graph: {
          nodes: [
            { id: 'C', label: 'C', x: 100, y: 100 },
            { id: 'A', label: 'A', x: 100, y: 30 },
            { id: 'B', label: 'B', x: 170, y: 100 },
            { id: 'D', label: 'D', x: 100, y: 170 },
            { id: 'E', label: 'E', x: 30, y: 100 }
          ],
          edges: [
            { from: 'C', to: 'A' },
            { from: 'C', to: 'B' },
            { from: 'C', to: 'D' },
            { from: 'C', to: 'E' }
          ]
        },
        solution: [
          'Step 1: Count edges incident on central vertex C: edges CA, CB, CD, CE (4 edges) -> deg(C) = 4.',
          'Step 2: Count edges incident on leaf vertices A, B, D, E. Each is connected only to C (1 edge each) -> deg(A)=1, deg(B)=1, deg(D)=1, deg(E)=1.'
        ],
        answer: 'deg(C) = 4, deg(A) = deg(B) = deg(D) = deg(E) = 1'
      }
    ],
    commonMistakes: [
      'Confusing the Order (vertices count) with the Size (edges count). Remember: Order = V, Size = E.',
      'Thinking a self-loop contributes 1 to a vertex degree. A self-loop always contributes 2 to the degree of its vertex!'
    ],
    examTips: [
      'Remember the basic graph definition: G = (V, E) is always requested in exams.',
      'Differentiate between Null graphs (many vertices, no edges) and Trivial graphs (exactly 1 vertex).'
    ],
    universityQuestions: [
      { type: 'Theory', question: 'Define a graph with a suitable example and real-world applications.' },
      { type: 'Theory', question: 'Explain the terms vertex, edge, order, and size of a graph.' },
      { type: 'Numerical', question: 'Find the order and size of G with V = {A,B,C,D,E} and E = {AB, AC, BC, CD, DE}.' }
    ]
  },
  {
    id: 'part2',
    part: 2,
    title: 'Types of Graphs',
    description: 'Directed and Undirected, Weighted and Unweighted, Complete, Regular, Connected, Cyclic and Bipartite structures.',
    definitions: [
      {
        term: 'Undirected Graph',
        definition: 'A graph in which edges have no direction. The relationship is mutual. If vertex A is connected to B, then B is connected to A.',
        exampleText: 'Facebook friendships (mutual), bidirectional road networks.',
        graph: {
          nodes: [
            { id: 'A', label: 'A', x: 50, y: 100 },
            { id: 'B', label: 'B', x: 130, y: 100 },
            { id: 'C', label: 'C', x: 210, y: 100 }
          ],
          edges: [
            { from: 'A', to: 'B' },
            { from: 'B', to: 'C' }
          ]
        }
      },
      {
        term: 'Directed Graph (Digraph)',
        definition: 'A graph in which every edge has a specific direction, denoted as an arrow from source to target. Edges are called Arcs.',
        exampleText: 'Instagram/Twitter followers (one-way), workflow step diagrams.',
        graph: {
          nodes: [
            { id: 'A', label: 'A', x: 50, y: 100 },
            { id: 'B', label: 'B', x: 130, y: 100 },
            { id: 'C', label: 'C', x: 210, y: 100 }
          ],
          edges: [
            { from: 'A', to: 'B', directed: true },
            { from: 'B', to: 'C', directed: true }
          ]
        }
      },
      {
        term: 'Weighted Graph',
        definition: 'A graph in which each edge is assigned a numerical weight or cost representing distance, time, capacity, or ticket price.',
        exampleText: 'Google Maps roads where weights represent physical distance or travel time.',
        graph: {
          nodes: [
            { id: 'A', label: 'A', x: 50, y: 120 },
            { id: 'B', label: 'B', x: 150, y: 50 },
            { id: 'C', label: 'C', x: 150, y: 180 }
          ],
          edges: [
            { from: 'A', to: 'B', weight: 5 },
            { from: 'A', to: 'C', weight: 4 },
            { from: 'B', to: 'C', weight: 7 }
          ]
        }
      },
      {
        term: 'Complete Graph (Kn)',
        definition: 'A simple graph where every single pair of distinct vertices is connected by a unique edge. Denoted as Kn.',
        formula: '|E| = n(n - 1) / 2',
        exampleText: 'K4 (Complete Graph with 4 vertices) has 4 * 3 / 2 = 6 edges.',
        graph: {
          nodes: [
            { id: 'A', label: 'A', x: 100, y: 30 },
            { id: 'B', label: 'B', x: 170, y: 100 },
            { id: 'C', label: 'C', x: 100, y: 170 },
            { id: 'D', label: 'D', x: 30, y: 100 }
          ],
          edges: [
            { from: 'A', to: 'B' },
            { from: 'A', to: 'C' },
            { from: 'A', to: 'D' },
            { from: 'B', to: 'C' },
            { from: 'B', to: 'D' },
            { from: 'C', to: 'D' }
          ]
        }
      },
      {
        term: 'Regular Graph',
        definition: 'A graph where all vertices have the exact same degree. If every vertex has degree k, it is called a k-Regular Graph.',
        exampleText: 'A simple square loop is a 2-Regular Graph because every corner connects to 2 neighbours.',
        graph: {
          nodes: [
            { id: 'A', label: 'A', x: 50, y: 50 },
            { id: 'B', label: 'B', x: 150, y: 50 },
            { id: 'C', label: 'C', x: 150, y: 150 },
            { id: 'D', label: 'D', x: 50, y: 150 }
          ],
          edges: [
            { from: 'A', to: 'B' },
            { from: 'B', to: 'C' },
            { from: 'C', to: 'D' },
            { from: 'D', to: 'A' }
          ]
        }
      },
      {
        term: 'Bipartite Graph',
        definition: 'A graph whose vertices can be split into two independent, disjoint sets V1 and V2 such that no two vertices within the same set are adjacent to each other.',
        exampleText: 'Matching students to course options; jobs to candidate slots.',
        graph: {
          nodes: [
            { id: 'A', label: 'A', x: 60, y: 60 },
            { id: 'B', label: 'B', x: 60, y: 140 },
            { id: 'C', label: 'C', x: 180, y: 40 },
            { id: 'D', label: 'D', x: 180, y: 100 },
            { id: 'E', label: 'E', x: 180, y: 160 }
          ],
          edges: [
            { from: 'A', to: 'C' },
            { from: 'A', to: 'D' },
            { from: 'B', to: 'D' },
            { from: 'B', to: 'E' }
          ]
        }
      },
      {
        term: 'Complete Bipartite Graph (Km,n)',
        definition: 'A Bipartite Graph with partitions of size m and n where every vertex in set V1 is connected to every vertex in set V2.',
        formula: '|E| = m * n',
        exampleText: 'K2,3 has 2 vertices in Set 1 and 3 in Set 2, creating exactly 2 * 3 = 6 edges.',
        graph: {
          nodes: [
            { id: 'A', label: 'A', x: 60, y: 70 },
            { id: 'B', label: 'B', x: 60, y: 150 },
            { id: 'C', label: 'C', x: 180, y: 40 },
            { id: 'D', label: 'D', x: 180, y: 100 },
            { id: 'E', label: 'E', x: 180, y: 160 }
          ],
          edges: [
            { from: 'A', to: 'C' },
            { from: 'A', to: 'D' },
            { from: 'A', to: 'E' },
            { from: 'B', to: 'C' },
            { from: 'B', to: 'D' },
            { from: 'B', to: 'E' }
          ]
        }
      }
    ],
    theorems: [
      {
        name: 'Edges in Complete Graph Theorem',
        statement: 'A complete graph Kn has exactly n(n-1)/2 edges.',
        formula: '|E| = n(n-1) / 2',
        explanation: 'Each of the n vertices can connect to n-1 other vertices. Since each connection (edge) is counted twice (once from each end), we divide by 2.'
      }
    ],
    solvedExamples: [
      {
        title: 'Example 1: Edges in K6',
        question: 'Calculate the total number of edges in a complete graph with 6 vertices (K6).',
        solution: [
          'Step 1: Identify the formula for the number of edges in a complete graph Kn.',
          'Formula: |E| = n * (n - 1) / 2',
          'Step 2: Substitute n = 6 into the formula.',
          '|E| = 6 * (6 - 1) / 2 = 6 * 5 / 2 = 30 / 2 = 15 edges.'
        ],
        answer: '15 edges'
      },
      {
        title: 'Example 2: Isomorphic and Regular Check',
        question: 'Is G with V={A,B,C,D} and E={AB, BC, CD, DA} a regular graph? If yes, what class?',
        solution: [
          'Step 1: List connections of each vertex to determine degrees.',
          'deg(A) connects to B, D -> 2; deg(B) connects to A, C -> 2; deg(C) connects to B, D -> 2; deg(D) connects to A, C -> 2.',
          'Step 2: Since all degrees are equal to 2, it is a Regular graph of class 2-Regular.'
        ],
        answer: 'Yes, it is a 2-Regular Graph'
      }
    ],
    commonMistakes: [
      'Assuming that every connected graph is a complete graph. (Complete graphs require direct connections between all pairs; connected graphs just require a path between them).',
      'Connecting vertices inside the same partition when drawing a Bipartite graph. Inner-set edges are strictly illegal.'
    ],
    examTips: [
      'The formula for Km,n size is |E| = m * n, while the number of vertices is m + n. These are frequently asked in multiple-choice questions.',
      'Check if every vertex has the exact same degree when proving if a graph is Regular.'
    ],
    universityQuestions: [
      { type: 'Theory', question: 'Differentiate between weighted and unweighted graphs with examples.' },
      { type: 'Theory', question: 'Define complete, regular, and bipartite graphs. Give standard notations.' },
      { type: 'Numerical', question: 'Find the number of edges in complete graphs K8 and K12.' }
    ]
  },
  {
    id: 'part3',
    part: 3,
    title: 'Handshaking Theorem & Sequences',
    description: 'Degree sums, Handshaking Theorem, vertex classification, and checking graphical sequences.',
    definitions: [
      {
        term: 'Degree of a Vertex',
        definition: 'The number of edges incident on a vertex. Denoted as deg(v). Self-loops count twice towards the degree of a vertex.',
        formula: 'deg(v)',
        exampleText: 'If vertex A has edges AB, AC and a self-loop, its total degree is 1 + 1 + 2 = 4.'
      },
      {
        term: 'Isolated Vertex',
        definition: 'A vertex with a degree of exactly 0. It has no connections or edges incident on it.',
        formula: 'deg(v) = 0',
        exampleText: 'A database server disconnected from a local cluster.'
      },
      {
        term: 'Pendant (Leaf) Vertex',
        definition: 'A vertex with a degree of exactly 1. It is attached to the rest of the graph by only one edge.',
        formula: 'deg(v) = 1',
        exampleText: 'The outer terminal node of a tree.'
      },
      {
        term: 'Degree Sequence',
        definition: 'A list of the degrees of all vertices in a graph G, traditionally arranged in non-increasing (descending) order.',
        exampleText: 'For vertices with degrees 2, 1, 4, 2, 1, the sorted Degree Sequence is (4, 2, 2, 1, 1).'
      },
      {
        term: 'Graphical Sequence',
        definition: 'A list of integers that can actually represent the degree sequence of some simple undirected graph.',
        exampleText: 'Sequence (2, 2, 2, 2) is graphical (square loop), but (5, 4, 3) is not because max degree with 3 vertices can only be 2.'
      }
    ],
    theorems: [
      {
        name: 'The Handshaking Theorem',
        statement: 'In any undirected graph, the sum of the degrees of all vertices is exactly equal to twice the number of edges.',
        formula: '∑ deg(v) = 2 |E|',
        explanation: 'Every single edge has exactly two endpoints. Therefore, when summing up the degrees of all vertices, every edge is counted exactly twice.'
      },
      {
        name: 'Corollary of Handshaking Theorem',
        statement: 'In any graph, the number of vertices having an odd degree must always be an even number.',
        explanation: 'Since the sum of all degrees is 2|E| (which is always an even number), the sum of degrees of odd vertices must also be even, meaning there must be an even count of them.'
      }
    ],
    solvedExamples: [
      {
        title: 'Example 1: Verify Handshaking Theorem',
        question: 'Verify the Handshaking Theorem for G with V={A,B,C,D} and E={AB, BC, CD, DA}.',
        solution: [
          'Step 1: Calculate the degrees of all vertices: deg(A)=2, deg(B)=2, deg(C)=2, deg(D)=2.',
          'Step 2: Compute the sum of the degrees: Sum = 2 + 2 + 2 + 2 = 8.',
          'Step 3: Count the number of edges: |E| = 4. Double this value: 2 * |E| = 2 * 4 = 8.',
          'Step 4: Compare results. Since Sum of degrees (8) = 2 * Edges (8), the Handshaking Theorem is verified.'
        ],
        answer: 'Verified: 8 = 2 * 4'
      },
      {
        title: 'Example 2: Check Degree Sequence Possibility',
        question: 'Is the degree sequence (3, 3, 2, 1, 1) possible for a simple graph?',
        solution: [
          'Step 1: Find the sum of all degrees. Sum = 3 + 3 + 2 + 1 + 1 = 10.',
          'Step 2: Check if the sum of degrees is even. 10 is even, so Handshaking theorem holds.',
          'Step 3: Count the number of vertices with odd degrees. Odd elements are 3, 3, 1, 1 (Count = 4). Since 4 is an even number, this condition is satisfied.',
          'Step 4: Check if any degree exceeds |V| - 1. Here, max degree is 3, and |V| is 5. 3 <= 5-1, which is valid.'
        ],
        answer: 'Yes, the sequence is graphical and possible'
      }
    ],
    commonMistakes: [
      'Counting a self-loop as 1 when finding vertex degrees. Always remember a loop contributes 2.',
      'Forgetting to sort the degree sequence in descending order. It is a mandatory convention for university exams.'
    ],
    examTips: [
      'A classic exam proof asks you to show that the number of odd-degree vertices is always even. Start your proof with the equation: Sum(deg_even) + Sum(deg_odd) = 2|E|.',
      'Always check if the sum of degrees is an even number first before drawing any complex graph conclusions.'
    ],
    universityQuestions: [
      { type: 'Theory', question: 'State and prove the Handshaking Theorem for undirected graphs.' },
      { type: 'Theory', question: 'Explain why the number of odd-degree vertices is always even.' },
      { type: 'Numerical', question: 'Verify if (4, 3, 3, 2, 1) and (5, 4, 3, 2, 2) can form simple graphs.' }
    ]
  },
  {
    id: 'part4',
    part: 4,
    title: 'Walks, Paths & Connectivity',
    description: 'Sequences of traversal, differences between walks, trails, paths, circuits, cycles, distance and eccentricity metrics.',
    definitions: [
      {
        term: 'Walk',
        definition: 'An alternating sequence of vertices and edges starting at a vertex and ending at a vertex, where each edge connects its endpoints.',
        exampleText: 'Vertices and edges can repeat with absolutely no restrictions. Length is the total number of edges used.'
      },
      {
        term: 'Trail',
        definition: 'A walk in which absolutely no edges are repeated. Vertices, however, are allowed to repeat.',
        exampleText: 'A walk that crosses different junctions but never travels the exact same street segment twice.'
      },
      {
        term: 'Path',
        definition: 'A trail in which no vertices (and consequently no edges) are allowed to repeat.',
        exampleText: 'A linear route from start to destination visiting each point exactly once.'
      },
      {
        term: 'Closed Walk',
        definition: 'A walk that starts and ends at the exact same vertex. Length is greater than 0.',
        exampleText: 'Starting at A, traveling through B and C, and returning to A.'
      },
      {
        term: 'Circuit',
        definition: 'A closed trail. It starts and ends at the same vertex and has no repeated edges. Vertices can repeat.',
        exampleText: 'A figure-8 route starting at the intersection.'
      },
      {
        term: 'Cycle',
        definition: 'A closed path. It starts and ends at the same vertex, and has no repeated edges and no repeated vertices (except that the start and end vertices are identical).',
        exampleText: 'A simple triangle or square loop traversal.'
      },
      {
        term: 'Distance d(u,v)',
        definition: 'The length of the shortest path connecting vertex u and vertex v.',
        formula: 'd(u,v)',
        exampleText: 'In a chain A-B-C, the distance from A to C is 2.'
      },
      {
        term: 'Eccentricity e(v)',
        definition: 'The maximum distance from a vertex v to any other vertex in the graph.',
        formula: 'e(v) = max { d(v, u) : u ∈ V }',
        exampleText: 'Helps locate the center or periphery of a network.'
      }
    ],
    theorems: [],
    solvedExamples: [
      {
        title: 'Example 1: Walk, Trail, or Path Classification',
        question: 'Identify the most specific classification of the traversal sequence A -> B -> C -> B -> D in the given graph.',
        solution: [
          'Step 1: Check for repeated edges. Edges used are AB, BC, CB, BD. Here, edge BC/CB is traversed twice. Since edges repeat, it cannot be a trail or a path.',
          'Step 2: Check if it is a valid walk. It is a sequence of connected vertices, so it is a Walk.'
        ],
        answer: 'Walk'
      },
      {
        title: 'Example 2: Eccentricity Calculation',
        question: 'Given a linear graph A - B - C - D, calculate the eccentricity of vertex B.',
        solution: [
          'Step 1: Calculate the distance from B to all other vertices.',
          'd(B, A) = 1',
          'd(B, C) = 1',
          'd(B, D) = 2',
          'Step 2: Find the maximum of these distances.',
          'e(B) = max(1, 1, 2) = 2.'
        ],
        answer: 'e(B) = 2'
      }
    ],
    commonMistakes: [
      'Confusing a trail (no repeated edges) with a path (no repeated vertices). Every path is a trail, but not every trail is a path.',
      'Measuring distance using a circuitous route instead of the absolute shortest path length.'
    ],
    examTips: [
      'Learn the standard summary table: Walk (V repeats, E repeats), Trail (V repeats, E no), Path (V no, E no). This is highly requested in theory sections.',
      'Eccentricity represents the worst-case communication delay from a node in a network.'
    ],
    universityQuestions: [
      { type: 'Theory', question: 'Define walk, trail, and path. Illustrate the differences with diagrams.' },
      { type: 'Theory', question: 'Explain the difference between a circuit and a cycle.' },
      { type: 'Numerical', question: 'In G where V={A,B,C,D,E} and E={AB,BC,CD,DE,EA,AC}, calculate the eccentricity of all vertices.' }
    ]
  },
  {
    id: 'part5',
    part: 5,
    title: 'Eulerian & Hamiltonian Graphs',
    description: 'Bridges of Königsberg historical origin, Euler trails/circuits, Hamiltonian paths/cycles, and validation conditions.',
    definitions: [
      {
        term: 'Euler Path',
        definition: 'A trail that visits every single edge in the graph G exactly once. Vertices are allowed to repeat.',
        exampleText: 'An envelope drawing where you draw all lines without lifting your pen and without repeating any line.'
      },
      {
        term: 'Euler Circuit',
        definition: 'An Euler Path that starts and ends at the exact same vertex. It traverses every edge exactly once and returns home.',
        exampleText: 'A complete traversal of a round-about city grid with zero street backtracking.'
      },
      {
        term: 'Euler Graph',
        definition: 'A connected graph that contains an Euler Circuit.',
        exampleText: 'A simple square with diagonal crossed edges is not Eulerian, but a double triangle share-vertex graph is.'
      },
      {
        term: 'Hamiltonian Path',
        definition: 'A path that visits every single vertex in the graph exactly once. Some edges can remain completely unused.',
        exampleText: 'A logistics delivery route visiting every warehouse exactly once.'
      },
      {
        term: 'Hamiltonian Cycle',
        definition: 'A Hamiltonian Path that starts and ends at the exact same vertex, visiting every vertex once and returning to the start.',
        exampleText: 'The core objective of the Travelling Salesman Problem (TSP).'
      },
      {
        term: 'Hamiltonian Graph',
        definition: 'A graph that contains a Hamiltonian Cycle.',
        exampleText: 'Any cycle graph or complete graph Kn (for n >= 3) is a Hamiltonian graph.'
      }
    ],
    theorems: [
      {
        name: 'Euler Graph Theorem',
        statement: 'A connected graph is Eulerian (contains an Euler Circuit) if and only if every single vertex has an even degree.',
        explanation: 'For any vertex visited along the circuit, the traveler must enter through one edge and leave through a different edge, contributing 2 to the degree. Thus, all degrees must be even.'
      },
      {
        name: 'Euler Path Condition',
        statement: 'A connected graph contains an Euler Path (but not an Euler Circuit) if and only if exactly two vertices have an odd degree.',
        explanation: 'The two vertices with odd degrees will serve as the unique starting point and ending point of the Euler Path, respectively.'
      }
    ],
    solvedExamples: [
      {
        title: 'Example 1: Classify Eulerian/Hamiltonian',
        question: 'Determine if a simple square graph ABCD is Eulerian, Hamiltonian, or both.',
        solution: [
          'Step 1: Check degrees of all vertices for Euler conditions. deg(A)=2, deg(B)=2, deg(C)=2, deg(D)=2. Since all degrees are even, G contains an Euler Circuit and is an Euler Graph.',
          'Step 2: Search for a Hamiltonian Cycle. The cycle A -> B -> C -> D -> A visits every vertex exactly once and returns to the start. Thus, G is also Hamiltonian.'
        ],
        answer: 'Both Eulerian and Hamiltonian'
      },
      {
        title: 'Example 2: Euler Path Check with Odd Degrees',
        question: 'Does G with degree sequence (3, 3, 2, 2) contain an Euler Path or Circuit?',
        solution: [
          'Step 1: Count the number of odd-degree vertices. Odd degrees are 3 and 3 (total count = 2).',
          'Step 2: Since there are exactly two vertices with odd degrees, G contains an Euler Path, but not an Euler Circuit.'
        ],
        answer: 'Contains an Euler Path (Not an Euler Circuit)'
      }
    ],
    commonMistakes: [
      'Confusing Euler (focuses on EDGES once) with Hamiltonian (focuses on VERTICES once). Remember: Euler = Edge, Hamilton = Home (Vertex).',
      'Using the Eulerian degree test on directed graphs without verifying inward and outward degree matches.'
    ],
    examTips: [
      'To easily remember the difference: Euler starts with E (Edges must be visited once); Hamiltonian starts with H (Homes/Vertices must be visited once).',
      'There is no simple, universal necessary-and-sufficient condition for Hamiltonian graphs, unlike Eulerian graphs which are instantly verified via degrees.'
    ],
    universityQuestions: [
      { type: 'Theory', question: 'State the necessary and sufficient conditions for a connected graph to be Eulerian.' },
      { type: 'Theory', question: 'Differentiate between Euler Graph and Hamiltonian Graph with neat tables.' },
      { type: 'Numerical', question: 'Determine whether a graph with degrees 2, 4, 3, 3, 2 is Eulerian, has an Euler path, or neither.' }
    ]
  },
  {
    id: 'part6',
    part: 6,
    title: 'Trees & Spanning Trees',
    description: 'Acyclic structures, parent-child terminologies, spanning tree bounds, and binary tree classifications.',
    definitions: [
      {
        term: 'Tree',
        definition: 'A connected, simple, undirected graph that contains absolutely no cycles (acyclic).',
        formula: '|E| = n - 1',
        exampleText: 'An organization chart or folder structure.',
        graph: {
          nodes: [
            { id: 'A', label: 'A', x: 120, y: 30 },
            { id: 'B', label: 'B', x: 60, y: 100 },
            { id: 'C', label: 'C', x: 180, y: 100 },
            { id: 'D', label: 'D', x: 30, y: 170 },
            { id: 'E', label: 'E', x: 90, y: 170 }
          ],
          edges: [
            { from: 'A', to: 'B' },
            { from: 'A', to: 'C' },
            { from: 'B', to: 'D' },
            { from: 'B', to: 'E' }
          ]
        }
      },
      {
        term: 'Spanning Tree',
        definition: 'A subgraph of G that includes every single vertex of G and is a tree (connected, acyclic).',
        formula: '|E_span| = n - 1',
        exampleText: 'A subset of communication lines connecting all systems with zero redundant loops.'
      },
      {
        term: 'Minimum Spanning Tree (MST)',
        definition: 'A spanning tree of a weighted connected graph that has the minimum possible total edge weight sum.',
        exampleText: 'Calculated using Kruskal’s or Prim’s algorithms to build utility grids at minimum costs.'
      },
      {
        term: 'Binary Tree',
        definition: 'A tree in which every single node has at most two children, termed the left child and the right child.',
        exampleText: 'Used to build decision trees, expression evaluation engines, and search indexes.'
      },
      {
        term: 'Full Binary Tree',
        definition: 'A binary tree in which every internal node has exactly two children. No node has only one child.',
        exampleText: 'All branching decisions are strictly binary (either yes/no with both outcomes developed).'
      },
      {
        term: 'Complete Binary Tree',
        definition: 'A binary tree in which all levels are completely filled except possibly the last, which is filled from left to right.',
        exampleText: 'Typically implemented using an array layout for binary heaps.'
      },
      {
        term: 'Perfect Binary Tree',
        definition: 'A binary tree where all internal nodes have exactly two children and all leaf nodes are at the exact same depth level.',
        exampleText: 'A perfectly balanced tree of height h containing 2^(h+1) - 1 nodes.'
      }
    ],
    theorems: [
      {
        name: 'Vertices and Edges Tree Theorem',
        statement: 'A tree with n vertices always contains exactly n - 1 edges.',
        formula: '|E| = n - 1',
        explanation: 'Every vertex except the root has exactly one incoming edge from its parent. This establishes a 1-to-1 match between the n-1 non-root nodes and the edges.'
      }
    ],
    solvedExamples: [
      {
        title: 'Example 1: Edges in a 12-Vertex Tree',
        question: 'How many edges are present in a tree having exactly 12 vertices?',
        solution: [
          'Step 1: Identify the fundamental tree edge property: |E| = n - 1.',
          'Step 2: Substitute n = 12 into the equation.',
          '|E| = 12 - 1 = 11 edges.'
        ],
        answer: '11 edges'
      },
      {
        title: 'Example 2: Spanning Tree Edges in K8',
        question: 'How many edges will a spanning tree of a complete graph K8 contain?',
        solution: [
          'Step 1: A spanning tree of any connected graph with n vertices must contain exactly n-1 edges.',
          'Step 2: Here, G is K8 which has n = 8 vertices.',
          'Step 3: Number of edges in the spanning tree = 8 - 1 = 7 edges.'
        ],
        answer: '7 edges'
      }
    ],
    commonMistakes: [
      'Assuming all binary trees are complete binary trees. A binary tree can be highly skewed (forming a single chain of nodes).',
      'Thinking a spanning tree of a graph G has fewer vertices than G. A spanning tree must include ALL vertices of G.'
    ],
    examTips: [
      'An extremely common theorem to prove is: \"A connected graph G with n vertices and n-1 edges is a tree.\" Base your proof on induction or cycle elimination.',
      'Remember: Spanning Tree size is always n-1, regardless of how many edges the original graph G has.'
    ],
    universityQuestions: [
      { type: 'Theory', question: 'Define a tree and discuss its six major structural properties.' },
      { type: 'Theory', question: 'What is a spanning tree? Explain Prim’s and Kruskal’s algorithms briefly.' },
      { type: 'Numerical', question: 'Find the number of edges in a tree with 25 vertices. Draw a tree with 6 vertices.' }
    ]
  }
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    type: 'multiple-choice',
    question: 'What is the sum of degrees of all vertices in a graph with 12 edges?',
    options: ['12', '24', '6', '11'],
    correctAnswer: '24',
    explanation: 'By the Handshaking Theorem, the sum of all vertex degrees is equal to twice the number of edges. Therefore, 2 * 12 = 24.'
  },
  {
    id: 'q2',
    type: 'true-false',
    question: 'A complete graph K5 has exactly 10 edges.',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation: 'Using the formula n(n-1)/2, we get 5 * (5 - 1) / 2 = 5 * 4 / 2 = 10 edges.'
  },
  {
    id: 'q3',
    type: 'multiple-choice',
    question: 'A connected graph contains an Euler Circuit if and only if:',
    options: [
      'It has exactly two vertices of odd degree.',
      'Every vertex has an even degree.',
      'It has no cycles.',
      'It is a complete graph.'
    ],
    correctAnswer: 'Every vertex has an even degree.',
    explanation: 'A connected graph is Eulerian if and only if every single vertex has an even degree, allowing a cycle that enters and exits every vertex without reusing edges.'
  },
  {
    id: 'q4',
    type: 'multiple-choice',
    question: 'How many edges are there in a tree with 50 vertices?',
    options: ['50', '49', '100', '25'],
    correctAnswer: '49',
    explanation: 'A tree with n vertices always has exactly n - 1 edges. Therefore, a tree with 50 vertices has 49 edges.'
  },
  {
    id: 'q5',
    type: 'true-false',
    question: 'A walk allows repetition of both vertices and edges, whereas a path allows no repetitions at all.',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation: 'A walk has no restrictions. A path is the most strict traversal, allowing absolutely no repeated vertices and no repeated edges.'
  },
  {
    id: 'q6',
    type: 'multiple-choice',
    question: 'What is the maximum degree of a vertex in a simple graph with 5 vertices?',
    options: ['5', '4', '10', '2'],
    correctAnswer: '4',
    explanation: 'In a simple graph (no self-loops or parallel edges), a vertex can connect to at most all other vertices. With 5 vertices total, a node can connect to at most 4 others.'
  },
  {
    id: 'q7',
    type: 'multiple-choice',
    question: 'A Bipartite graph Km,n has how many edges?',
    options: ['m + n', 'm * n', 'm * (n - 1)', 'm^2 + n^2'],
    correctAnswer: 'm * n',
    explanation: 'A complete bipartite graph Km,n connects every vertex of the partition of size m to every vertex of the partition of size n, making m * n edges.'
  },
  {
    id: 'q8',
    type: 'true-false',
    question: 'An isolated vertex has a degree of 1, while a pendant vertex has a degree of 0.',
    options: ['True', 'False'],
    correctAnswer: 'False',
    explanation: 'An isolated vertex has degree 0 (it is isolated). A pendant or leaf vertex has degree 1.'
  }
];
