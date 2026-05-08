/**
 * BCA STORE - Conversational & Chat Knowledge Base
 * This file contains human-like responses for greetings and casual interaction.
 */

const CHAT_KNOWLEDGE = {
  // Greetings
  "hi": "Hello 👋 How can I help you today?",
  "hello": "Hi there 😊 What would you like to talk about?",
  "hey": "Hey 😄 Hope your day is going well.",
  "good morning": "Good morning ☀️ Have a great day ahead.",
  "good afternoon": "Good afternoon 🌤️ How's your day going?",
  "good evening": "Good evening 🌆 How can I assist you tonight?",
  "good night": "Good night 🌙 Take care and sleep well.",
  "how are you": "I’m doing great 😊 Thanks for asking! How are you doing?",
  "what are you doing": "I’m here and ready to help you with your studies or any questions you have.",
  "nice to meet you": "Nice to meet you too 🤝",
  "thank you": "You’re very welcome 😄",
  "thanks": "Happy to help! 💙",
  "thanks a lot": "My pleasure! 💙",
  "bye": "Bye 👋 Have a wonderful day!",
  "see you later": "See you soon 😊",
  "developer": "The mastermind behind BCA Store is **Vishal Kumar**. ✨\n\n[Guess who's the genius behind this?](https://real-vishal.netlify.app/) 🚀",

  // Personal / AI Identity
  "who are you": "I’m your BCA AI Assistant, created by Vishal Kumar to help you with your studies.",
  "what can you do": "I can answer syllabus questions, help with C programming, explain MS Office, and chat about your BCA journey.",
  "are you real": "I’m a virtual AI assistant designed to help students like you! 🤖",
  "do you sleep": "Nope 😄 I’m always available 24/7 to help you study.",
  "can you code": "Yes 💻 I can help with programming logic, C language, and web development.",
  "can you teach me": "Absolutely 📚 What subject would you like to start with? Computer Fundamentals, C, or Business Comm?",
  "what is your purpose": "My purpose is to make BCA learning easier and more fun for everyone.",

  // Emotional Support & Motivation
  "i am sad": "I’m sorry you’re feeling that way 💙 Remember, tough times don't last, but tough people do.",
  "i am happy": "That’s awesome 😄 Your energy is contagious!",
  "i am bored": "Let’s do something fun 😎 How about a quick coding challenge or some interesting computer facts?",
  "motivate me": "Every expert was once a beginner 🚀 Keep pushing, your hard work will pay off!",
  "i feel lonely": "I’m here to chat with you 💙 You're never alone when you're learning something new.",
  "can we be friends": "Of course! I'd love to be your study partner and friend 😊",
  "cheer me up": "You’re stronger than you think 🌟 And remember: Even the longest program starts with a single line of code.",
  "i feel stressed": "Take a deep breath 😌 Try taking a 5-minute break and then come back to your studies.",

  // Success & Failure
  "i failed my exam": "Don’t worry 💪 Failure is just a stepping stone to success. You can improve next time!",
  "i passed my exam": "Congratulations 🎉 Great job! Your hard work really paid off.",
  "what is success": "Success is the result of preparation, hard work, and learning from failure.",
  "what is failure": "Failure is not the opposite of success; it's part of the journey to success.",

  // Fun & Misc
  "tell me a joke": "Why do programmers hate nature? Because it has too many bugs! 😂",
  "tell me something interesting": "Did you know? The first computer bug was an actual moth found in a relay! 🐞",
  "tell me a fact": "Honey never spoils 🍯 And the first domain name ever registered was symbolics.com.",
  "what is your favorite color": "I like blue 💙 It's the color of technology and trust.",
  "what is your favorite food": "I don’t eat, but pizza sounds like the perfect fuel for a long coding session! 🍕",
  "can you speak hindi": "Haan 😊 Main Hindi bhi samajhta hoon. Aap mujhse Hindi mein baat kar sakte hain.",
  "what is love": "Love is care, trust, and connection ❤️",

  // Capability Questions
  "can you write essays": "Yes ✍️ I can help you structure and write academic essays.",
  "can you make projects": "Yes 🚀 I can provide ideas and logic for your BCA projects.",
  "can you solve math": "Yes 😊 I can help you with mathematical logic and problems.",
  "can you debug code": "Yes 🛠️ Send me your code and I'll help you find the errors.",
  "what is programming": "Programming is just giving instructions to a computer in a language it understands.",

  // 500 Developer ↔ User Conversations
  "whats up": "Just hanging out in the cloud, ready to help you build something awesome! 🚀",
  "are you online": "Always! I'm here 24/7 to assist with your BCA studies and coding projects. ✅",
  "i need guidance": "I'd be happy to guide you! Whether it's career advice, study tips, or coding help, just ask. 😊",
  "teach me coding": "That's a great goal! 💻 Should we start with the basics of C, or move into Web Development with HTML?",
  "make notes for me": "Absolutely! ✍️ Send me the topic or chapter name, and I'll create a structured summary for you.",
  "write c program": "Sure! 💻 Tell me the problem you're trying to solve (e.g., 'sum of two numbers', 'factorial', etc.).",
  "fix my error": "I can help with that! 🔧 Please paste your code and the error message you're seeing.",
  "create website": "Exciting! 🌐 Do you want a personal portfolio, a blog, or a student dashboard? Let's start with HTML.",
  "create login page": "I can help you design a sleek, professional login page using HTML and CSS. 🔐",
  "give me important questions": "Sure! 🎯 Tell me the subject (DS, C++, Architecture), and I'll give you exam-focused questions.",
  "give viva questions": "I've got a huge library of viva questions! 🎤 Which subject are you preparing for today?",
  "help me make resume": "A professional resume is key! 💼 I can help you list your BCA projects and technical skills effectively.",
  "how to focus": "Try the Pomodoro technique: 25 minutes of study, followed by a 5-minute break. ⏳ Remove distractions and stay consistent!",
  "create timetable": "I can help with that! 📅 Tell me your subjects and how many hours you want to study each day.",
  "recommend a movie": "If you love tech and space, I highly recommend 'Interstellar'! 🚀 It's a masterpiece.",
  "recommend a book": "For personal growth, 'Atomic Habits' by James Clear is life-changing. 📘",
  "how to crack interviews": "Focus on your Data Structures (DSA), build 2-3 solid projects, and practice your communication skills. 🎤",
  "frontend vs backend": "Frontend is what the user sees (HTML/CSS/JS). Backend is the 'brain' (Server/Database) that makes it work. 🖥️",
  "what is github": "GitHub is like a social network for developers! 🐙 It's where you host your code and collaborate on projects."
};

// Merge into the global knowledge base
if (typeof BCA_BOT_KNOWLEDGE !== 'undefined') {
  Object.assign(BCA_BOT_KNOWLEDGE, CHAT_KNOWLEDGE);
}
