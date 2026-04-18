window.safeSkillsPublishedCourse = {
  id: "published-safe-skills-course",
  title: "Safe Skills Driving School Member Course",
  description: "A published Safe Skills Driving School course with topic pages, timed sub-pages, topic quizzes, and a final exam.",
  price: "$49.00",
  passingScore: 80,
  topics: [
    {
      id: "topic-1",
      title: "Topic 1 - Course Introduction",
      summary: "Welcome students to the course and explain how timed sub-pages and quizzes work.",
      subpages: [
        {
          id: "topic-1-subpage-1",
          title: "Slide 1 - Welcome",
          minutesRequired: 2,
          content: "<p>Welcome to your Safe Skills Driving School online course.</p><p>Each sub-page must be viewed for the required time before you can move forward.</p>",
          imageUrl: "",
          videoUrl: ""
        },
        {
          id: "topic-1-subpage-2",
          title: "Slide 2 - How the Course Works",
          minutesRequired: 2,
          content: "<p>Progress is tracked page by page.</p><p>After you finish the sub-pages in a topic, you complete the topic quiz before the next topic opens.</p>",
          imageUrl: "",
          videoUrl: ""
        }
      ],
      quiz: [
        {
          id: "topic-1-quiz-1",
          question: "What must be completed before the next topic opens?",
          options: [
            "All timed sub-pages and the topic quiz",
            "Only the first sub-page",
            "Nothing, topics can be skipped"
          ],
          correctAnswer: "All timed sub-pages and the topic quiz"
        }
      ]
    },
    {
      id: "topic-2",
      title: "Topic 2 - Safe Driving Review",
      summary: "Review the course content and prepare for the final exam.",
      subpages: [
        {
          id: "topic-2-subpage-1",
          title: "Slide 1 - Key Safety Points",
          minutesRequired: 2,
          content: "<p>Review the key ideas from the course before continuing to the final exam.</p><ul><li>Complete each page in order</li><li>Answer each quiz carefully</li><li>Finish the course to unlock your certificate</li></ul>",
          imageUrl: "",
          videoUrl: ""
        }
      ],
      quiz: [
        {
          id: "topic-2-quiz-1",
          question: "What do students unlock after passing the final exam?",
          options: [
            "A certificate",
            "A toolkit upload",
            "An admin login"
          ],
          correctAnswer: "A certificate"
        }
      ]
    }
  ],
  finalExam: [
    {
      id: "final-1",
      question: "When do you move to the next topic in this course?",
      options: [
        "After finishing the topic sub-pages and quiz",
        "Whenever you want",
        "Only after logging out"
      ],
      correctAnswer: "After finishing the topic sub-pages and quiz"
    },
    {
      id: "final-2",
      question: "What does passing the final exam provide?",
      options: [
        "A certificate of completion",
        "A chapter upload",
        "A new password"
      ],
      correctAnswer: "A certificate of completion"
    }
  ]
};
