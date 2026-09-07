
import { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";

import { get, post } from "../services/api.js";

import AppShell from "../components/AppShell.jsx";

import Loader from "../components/Loader.jsx";

export default function ChapterLearning() {
  const { subjectId, chapterId } = useParams();

  const [ch, setCh] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const data = await get(`/chapters/${chapterId}`);
      setCh(data);
    } catch (err) {
      setError(err.message || "Unable to load chapter.");
    }
  };

  useEffect(() => {
    load();

    post(`/progress/chapter/${chapterId}/access`).catch(() => {});
  }, [chapterId]);

  if (error) {
    return (
      <AppShell>
        <div className="page">
          <div className="alert error">{error}</div>
        </div>
      </AppShell>
    );
  }

  if (!ch) {
    return (
      <AppShell>
        <Loader label="Loading chapter..." />
      </AppShell>
    );
  }

  const complete = async () => {
    try {
      await post(`/progress/chapter/${chapterId}/complete`);

      setCh({
        ...ch,
        completed: true,
      });
    } catch (err) {
      setError(err.message || "Unable to mark chapter as complete.");
    }
  };

  const learningContent = ch.learningContent || {};

  return (
    <AppShell>
      <article className="learning-page">

        {}
        <div className="breadcrumb">
          <Link to="/dashboard">Dashboard</Link>

          <span>›</span>

          <Link to={`/subject/${subjectId}`}>
            {ch.subject.name}
          </Link>

          <span>›</span>

          <span>Chapter {ch.chapterNumber}</span>
        </div>


        {}
        <div className="eyebrow">
          {ch.subject.name} · Chapter {ch.chapterNumber}
        </div>

        <h1>{ch.title}</h1>

        <p className="lead">
          {ch.description}
        </p>


        {}
        {learningContent.videoUrl && (
          <section className="learning-section video-section">

            <div className="section-heading">
              <span className="section-icon">🎬</span>

              <div>
                <h2>Watch the Lesson</h2>
                <p>
                  Watch the animated lesson before starting the activities.
                </p>
              </div>
            </div>

            <div className="video-container">
              <video
                className="chapter-video"
                controls
                playsInline
                preload="metadata"
              >
                <source
                  src={learningContent.videoUrl}
                  type="video/mp4"
                />

                Your browser does not support video playback.
              </video>
            </div>

          </section>
        )}


        {}
        {learningContent.explanationUrl && (
          <section className="learning-section explanation-section">

            <div className="section-heading">
              <span className="section-icon">📖</span>

              <div>
                <h2>Introduction</h2>

                <p>
                  Read the explanation carefully to understand the topic.
                </p>
              </div>
            </div>

            <div className="explanation-container">
              <iframe
                src={learningContent.explanationUrl}
                title={`${ch.title} explanation`}
                className="explanation-frame"
                loading="lazy"
              />
            </div>

          </section>
        )}


        {}
        {(learningContent.gameUrl || learningContent.quizUrl) && (
          <section className="learning-section activities-section">

            <div className="section-heading">
              <span className="section-icon">🚀</span>

              <div>
                <h2>Practice & Test Yourself</h2>

                <p>
                  Put what you learned into practice.
                </p>
              </div>
            </div>


            <div className="activity-buttons">

              {learningContent.gameUrl && (
                <a
                  href={learningContent.gameUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="activity-card game-card"
                >
                  <span className="activity-icon">🎮</span>

                  <span className="activity-content">
                    <strong>Play the Game</strong>

                    <small>
                      Practice the topic with an interactive game
                    </small>
                  </span>

                  <span className="activity-arrow">→</span>
                </a>
              )}


              {learningContent.quizUrl && (
                <a
                  href={learningContent.quizUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="activity-card quiz-card"
                >
                  <span className="activity-icon">📝</span>

                  <span className="activity-content">
                    <strong>Take the Quiz</strong>

                    <small>
                      Test your understanding of this chapter
                    </small>
                  </span>

                  <span className="activity-arrow">→</span>
                </a>
              )}

            </div>

          </section>
        )}


        {}
        {!learningContent.explanationUrl && ch.content && (
          <section className="learning-section">
            <div className="chapter-content">
              {ch.content}
            </div>
          </section>
        )}


        {}
        <div className="chapter-actions">

          {ch.previous ? (
            <Link
              className="btn btn-ghost"
              to={`/subject/${subjectId}/chapter/${ch.previous._id}`}
            >
              ← Previous Chapter
            </Link>
          ) : (
            <span />
          )}


          <button
            className="btn"
            onClick={complete}
            disabled={ch.completed}
          >
            {ch.completed
              ? "Completed ✓"
              : "Mark as Complete"}
          </button>


          {ch.next ? (
            <Link
              className="btn btn-ghost"
              to={`/subject/${subjectId}/chapter/${ch.next._id}`}
            >
              Next Chapter →
            </Link>
          ) : (
            <Link
              className="btn btn-ghost"
              to={`/subject/${subjectId}`}
            >
              Subject Overview →
            </Link>
          )}

        </div>

      </article>
    </AppShell>
  );
}