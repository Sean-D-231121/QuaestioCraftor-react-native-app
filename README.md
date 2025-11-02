![GitHub repo size](https://img.shields.io/github/repo-size/Sean-D-231121/QuaestioCraftor-react-native-app)
![GitHub watchers](https://img.shields.io/github/watchers/Sean-D-231121/QuaestioCraftor-react-native-app)
![GitHub language count](https://img.shields.io/github/languages/count/Sean-D-231121/QuaestioCraftor-react-native-app)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/Sean-D-231121/QuaestioCraftor-react-native-app)
![GitHub Language](https://img.shields.io/github/languages/top/Sean-D-231121/QuaestioCraftor-react-native-app)
![GitHub Downloads](https://img.shields.io/github/downloads/Sean-D-231121/QuaestioCraftor-react-native-app/total)

<h3 align="center">QuaestioCraftor</h3>
<h5 align="center">AI-Powered Quiz Creation & Learning Experience</h5>
</br>
<p align="center">
  <a href="https://github.com/Sean-D-231121/QuaestioCraftor-react-native-app">
    <img src="assets/Logo.png" align="center" alt="QuaestioCraftor Logo" width="auto" height="140">
  </a>
  <br />
  <br />
  <a href="#">View Demo</a>
  ·
  <a href="https://github.com/Sean-D-231121/QuaestioCraftor-react-native-app/issues">Report Bug</a>
  ·
  <a href="https://github.com/Sean-D-231121/QuaestioCraftor-react-native-app/issues">Request Feature</a>
</p>

---

## Table of Contents

* [About the Project](#about-the-project)
  * [Project Description](#project-description)
  * [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [How to Install](#how-to-install)
* [Features and Functionality](#features-and-functionality)
* [Concept Process](#concept-process)
  * [Ideation](#ideation)
  * [Wireframes](#wireframes)
  * [Style Guide](#style-guide)
* [Development Process](#development-process)
  * [Implementation Process](#implementation-process)
    * [Highlights](#highlights)
    * [Challenges](#challenges)
  * [Future Implementation](#future-implementation)
* [Final Outcome](#final-outcome)
  * [Mockups](#mockups)
  * [Video Demonstration](#video-demonstration)
* [Conclusion](#conclusion)
* [License](#license)
* [Contact](#contact)
* [Acknowledgements](#acknowledgements)

---

## About the Project

### Project Description

**QuaestioCraftor** is an **AI-driven React Native quiz application** designed to help users learn through smart, dynamically generated quizzes.  
Using AI prompt responses, users can create unique quiz sets, track their progress, and enhance knowledge retention across topics.  

Built with **React Native** and **Supabase** for backend storage and authentication, QuaestioCraftor integrates modern UI/UX practices from **React Native Paper**, **Framer Motion**, and **Expo** for a seamless learning experience.  

---

### Built With

- **Frontend / Mobile**
  - [React Native](https://reactnative.dev/)
  - [Expo](https://expo.dev/)
  - [React Navigation](https://reactnavigation.org/)
  - [React Native Paper](https://callstack.github.io/react-native-paper/)

- **Backend / Database**
  - [Supabase](https://supabase.io/)
  - [OpenAI API / AI Service Integration](https://platform.openai.com/)
  - [PostgreSQL](https://www.postgresql.org/)

- **UI / Styling**
  - [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)
  - [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
  - [Expo Vector Icons](https://icons.expo.fyi/)
  - [React Native Paper Components](https://callstack.github.io/react-native-paper/)

---

## Getting Started

### Prerequisites

- **Node.js** (v16+)
- **Expo CLI** installed globally:
```sh
npm install -g expo-cli
```
### How To install

1. Clone Repository:
```sh
git clone https://github.com/Sean-D-231121/QuaestioCraftor-react-native-app.git
```
2. Navigate into the folder:
```sh
cd QuaestioCraftor-react-native-app
```
3. Install dependencies:
```sh
npm install
```
4. Set up Supabase and Environment Variables:
Create a .env file in the root directory:
```sh
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```
5. Query Database in supabase:
```sh
CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  username text NOT NULL,
  email text NOT NULL UNIQUE,
  points integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  avatar_url text,
  auth_id uuid,
  CONSTRAINT users_pkey PRIMARY KEY (id)
);

CREATE TABLE public.quizzes (
  quizid uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  topic text NOT NULL,
  quiz_type text NOT NULL,
  difficulty text NOT NULL,
  question_count integer NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT quizzes_pkey PRIMARY KEY (quizid),
  CONSTRAINT quizzes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL
);

CREATE TABLE public.questions (
  question_id uuid NOT NULL DEFAULT gen_random_uuid(),
  quiz_id uuid,
  question_text text NOT NULL,
  answer text NOT NULL,
  type text NOT NULL,
  options jsonb,
  CONSTRAINT questions_pkey PRIMARY KEY (question_id),
  CONSTRAINT questions_quiz_id_fkey FOREIGN KEY (quiz_id) REFERENCES public.quizzes(quizid) ON DELETE CASCADE
);

CREATE TABLE public.quiz_attempts (
  attempt_id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  quiz_id uuid,
  score integer,
  total integer,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT quiz_attempts_pkey PRIMARY KEY (attempt_id),
  CONSTRAINT quiz_attempts_quiz_id_fkey FOREIGN KEY (quiz_id) REFERENCES public.quizzes(quizid) ON DELETE CASCADE,
  CONSTRAINT quiz_attempts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

CREATE TABLE public.submitted_answers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  attempt_id uuid,
  question_id uuid,
  selected_answer text,
  correct_answer text,
  is_correct boolean,
  CONSTRAINT submitted_answers_pkey PRIMARY KEY (id),
  CONSTRAINT submitted_answers_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(question_id) ON DELETE CASCADE,
  CONSTRAINT submitted_answers_attempt_id_fkey FOREIGN KEY (attempt_id) REFERENCES public.quiz_attempts(attempt_id) ON DELETE CASCADE
);

```
6. Clone backend repository/ [Go to Backend](https://github.com/Sean-D-231121/QuaestioCraftor-backend)
```sh
https://github.com/Sean-D-231121/QuaestioCraftor-backend.git
```
7. Create a virtual environment
```sh
python -m venv .venv
```
8. Activate it:
```sh
.venv\Scripts\activate
```
9. Create .env in QuaestiCraftor Backend and setup OpenAI API 
```sh
OPENAI_API_KEY=YOUR_API_KEY
```

11. Install dependencies:
```sh
pip install --upgrade pip
pip install -r requirements.txt
```

12. Start Backend app
```sh
uvicorn main:app --reload
```
13. Run the app:
```sh
npx expo start
```
Alternatively
```sh
npm start
```

## Features and Functionality

### AI Quiz Generation

Create quizzes powered by AI-generated topics and questions.

Choose difficulty levels and topics dynamically.

### Quiz History

View past quizzes with scores, topics, and timestamps.

### Leaderboard

Compete with other users or compare your personal progress.

### Profile

Manage user details, avatars, and stats.

Integration with Supabase authentication.

### Smooth UI and Animations

Clean interface with consistent color scheme and transitions.

Integrated React Native Paper design components.

### Quiz Insights

Visual progress overview and statistics.

Insights generated from your quiz attempts.
   
Concept Process
Ideation

The concept began with the idea of "AI as a learning companion" — transforming studying into a personalized experience.
Instead of static question banks, QuaestioCraftor leverages AI to generate quizzes tailored to user-selected topics and moods, promoting curiosity-based learning.

Core ideas:

Personalized quizzes from natural language prompts.

Real-time feedback and tracking.

A gamified leaderboard for motivation.

Wireframes
<p align="center"> <img src="assets/wireframe-home.png" width="25%" /> <img src="" width="25%" /> <img src="assets/wireframe-profile.png" width="25%" /> </p>
Style Guide
<p align="center"> <img src="assets/colors.png" width="30%" /> <img src="" width="30%" /> <img src="assets/icons.png" width="30%" /> </p>

## Development Process
### Implementation Process
### Frontend (React Native + Expo)

Developed modular screens using React Navigation.

Implemented animations with Reanimated and Framer Motion.

Integrated Supabase auth and API services.

Styled components with React Native Paper.

### Backend (Supabase + AI Integration)

Connected Supabase for real-time data and auth.

Integrated AI prompt processing for dynamic quiz generation.

Used Supabase Postgres for storing user progress and quiz history.

## Highlights


## Challenges

## Future Implementation

## Final Outcome
### Mockups
<p align="center"> <img src="assets/mockup-1.png" width="80%" /> <img src="assets/mockup-2.png" width="80%" /> <img src="assets/mockup-3.png" width="80%" /> </p>
Video Demonstration

[View Demo]()

## Conclusion

## License
Distributed under the MIT License. See LICENSE for more information

Contact

Sean Dubbelman
📧 231121@virtualwindow.co.za
🔗 GitHub: @Sean-D-231121

## Acknowledgements
