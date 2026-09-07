
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo.jsx";
import "./AdminChapter.css";

const API_URL = "http://localhost:5000/api";

export default function AdminChapter() {
  const navigate = useNavigate();

  const [educations, setEducations] = useState([]);
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [form, setForm] = useState({
    educationId: "",
    courseId: "",
    subjectId: "",
    chapterNumber: "",
    title: "",
    description: "",
  });

  const [explanationFiles, setExplanationFiles] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [gameFiles, setGameFiles] = useState([]);
  const [quizFiles, setQuizFiles] = useState([]);

  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  
  
  

  useEffect(() => {
    const loadEducations = async () => {
      try {
        setLoadingSubjects(true);
        setError("");

        const response = await fetch(`${API_URL}/education`, {
          credentials: "include",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to load education");
        }

        const educationList = result.data || [];
        setEducations(educationList);

        if (!form.educationId && educationList.length > 0) {
          setForm((prev) => ({ ...prev, educationId: educationList[0]._id }));
        }
      } catch (err) {
        console.error("Load education error:", err);
        setError(err.message);
      } finally {
        setLoadingSubjects(false);
      }
    };

    loadEducations();
  }, []);

  useEffect(() => {
    const loadCoursesAndSubjects = async () => {
      if (!form.educationId) {
        setCourses([]);
        setSubjects([]);
        setForm((prev) => ({ ...prev, courseId: "", subjectId: "" }));
        return;
      }

      try {
        setLoadingSubjects(true);
        setError("");

        const education = educations.find((item) => item._id === form.educationId);
        const requiresCourse = education?.requiresCourse;

        if (requiresCourse) {
          const courseResponse = await fetch(
            `${API_URL}/courses/education/${form.educationId}`,
            { credentials: "include" }
          );
          const courseResult = await courseResponse.json();

          if (!courseResponse.ok) {
            throw new Error(courseResult.message || "Failed to load courses");
          }

          const courseList = courseResult.data || [];
          setCourses(courseList);

          if (courseList.length === 0) {
            setSubjects([]);
            setForm((prev) => ({ ...prev, courseId: "", subjectId: "" }));
            return;
          }

          const selectedCourseId = form.courseId || courseList[0]._id;
          setForm((prev) => ({ ...prev, courseId: selectedCourseId }));

          const subjectResponse = await fetch(
            `${API_URL}/subjects?education=${form.educationId}&course=${selectedCourseId}`,
            { credentials: "include" }
          );
          const subjectResult = await subjectResponse.json();

          if (!subjectResponse.ok) {
            throw new Error(subjectResult.message || "Failed to load subjects");
          }

          const subjectList = subjectResult.data || [];
          setSubjects(subjectList);

          if (!subjectList.some((subject) => subject._id === form.subjectId)) {
            setForm((prev) => ({ ...prev, subjectId: subjectList[0]?._id || "" }));
          }
        } else {
          setCourses([]);
          const subjectResponse = await fetch(
            `${API_URL}/subjects?education=${form.educationId}`,
            { credentials: "include" }
          );
          const subjectResult = await subjectResponse.json();

          if (!subjectResponse.ok) {
            throw new Error(subjectResult.message || "Failed to load subjects");
          }

          const subjectList = subjectResult.data || [];
          setSubjects(subjectList);
          setForm((prev) => ({ ...prev, courseId: "", subjectId: subjectList[0]?._id || "" }));
        }
      } catch (err) {
        console.error("Load courses/subjects error:", err);
        setError(err.message);
        setCourses([]);
        setSubjects([]);
      } finally {
        setLoadingSubjects(false);
      }
    };

    loadCoursesAndSubjects();
  }, [form.educationId, educations]);

  const handleEducationChange = (e) => {
    const educationId = e.target.value;
    setForm((prev) => ({
      ...prev,
      educationId,
      courseId: "",
      subjectId: "",
    }));
  };

  const handleCourseChange = (e) => {
    const courseId = e.target.value;
    setForm((prev) => ({
      ...prev,
      courseId,
      subjectId: "",
    }));
  };

  useEffect(() => {
    const loadSubjectsForCourse = async () => {
      if (!form.educationId) return;
      if (form.courseId === "") {
        setSubjects([]);
        return;
      }

      try {
        setLoadingSubjects(true);
        const response = await fetch(
          `${API_URL}/subjects?education=${form.educationId}&course=${form.courseId}`,
          { credentials: "include" }
        );
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to load subjects");
        }

        const subjectList = result.data || [];
        setSubjects(subjectList);
        setForm((prev) => ({ ...prev, subjectId: subjectList[0]?._id || "" }));
      } catch (err) {
        console.error("Load subject list error:", err);
        setError(err.message);
      } finally {
        setLoadingSubjects(false);
      }
    };

    const education = educations.find((item) => item._id === form.educationId);
    if (!education?.requiresCourse || !form.courseId) return;

    loadSubjectsForCourse();
  }, [form.courseId, form.educationId, educations]);

  
  
  

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  
  
  

  const handleExplanationFiles = (e) => {
    const files = Array.from(e.target.files || []);

    setExplanationFiles(files);
    setError("");
    setMessage("");
  };

  
  
  

  const handleVideoFile = (e) => {
    const file = e.target.files?.[0] || null;

    setVideoFile(file);
    setError("");
    setMessage("");
  };

  
  
  

  const handleGameFiles = (e) => {
    const files = Array.from(e.target.files || []);

    setGameFiles(files);
    setError("");
    setMessage("");
  };

  
  
  

  const handleQuizFiles = (e) => {
    const files = Array.from(e.target.files || []);

    setQuizFiles(files);
    setError("");
    setMessage("");
  };

  
  
  

  const getRelativePath = (file) => {
    

    if (!file.webkitRelativePath) {
      return file.name;
    }

    const parts = file.webkitRelativePath.split("/");

    if (parts.length <= 1) {
      return file.name;
    }

    return parts.slice(1).join("/");
  };

  
  
  

  const appendFiles = (formData, fieldName, files) => {
    files.forEach((file) => {
      formData.append(fieldName, file);

      

      formData.append(
        `${fieldName}Paths`,
        getRelativePath(file)
      );
    });
  };

  
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    
    
    

    if (!form.subjectId) {
      setError("Please select a subject.");
      return;
    }

    if (!form.chapterNumber) {
      setError("Please enter chapter number.");
      return;
    }

    if (!form.title.trim()) {
      setError("Please enter chapter title.");
      return;
    }

    if (
      videoFile &&
      videoFile.size > 500 * 1024 * 1024
    ) {
      setError(
        "Video file cannot be larger than 500 MB."
      );
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      
      
      

      formData.append(
        "subjectId",
        form.subjectId
      );

      formData.append(
        "chapterNumber",
        form.chapterNumber
      );

      formData.append(
        "title",
        form.title
      );

      formData.append(
        "description",
        form.description
      );

      
      
      

      appendFiles(
        formData,
        "explanationFiles",
        explanationFiles
      );

      
      
      

      if (videoFile) {
        formData.append(
          "video",
          videoFile
        );
      }

      
      
      

      appendFiles(
        formData,
        "gameFiles",
        gameFiles
      );

      
      
      

      appendFiles(
        formData,
        "quizFiles",
        quizFiles
      );

      
      
      

      const response = await fetch(
        `${API_URL}/admin/chapter`,
        {
          method: "POST",

          credentials: "include",

          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Chapter upload failed"
        );
      }

      console.log(
        "Chapter upload result:",
        result
      );

      setMessage(
        "Chapter uploaded successfully!"
      );

      
      
      

      setForm({
        educationId: form.educationId,
        courseId: form.courseId,
        subjectId: "",
        chapterNumber: "",
        title: "",
        description: "",
      });

      setExplanationFiles([]);
      setVideoFile(null);
      setGameFiles([]);
      setQuizFiles([]);

      
      document
        .querySelectorAll(
          "input[type='file']"
        )
        .forEach((input) => {
          input.value = "";
        });
    } catch (err) {
      console.error(
        "Chapter upload error:",
        err
      );

      setError(
        err.message ||
          "Something went wrong while uploading."
      );
    } finally {
      setUploading(false);
    }
  };

  
  
  

  const FileList = ({ files }) => {
    if (!files || files.length === 0) {
      return (
        <p className="no-files">
          No files selected
        </p>
      );
    }

    return (
      <div className="file-list">
        {files.map((file, index) => (
          <div
            className="file-item"
            key={`${file.name}-${index}`}
          >
            <div className="file-info">
              <strong>
                {file.name}
              </strong>

              <small>
                {getRelativePath(file)}
              </small>
            </div>
          </div>
        ))}
      </div>
    );
  };

  
  
  

  return (
    <div className="admin-page">

      <div className="admin-container">

        <div className="admin-brand">
          <Logo />
        </div>

        {}
        {}
        {}

        <div className="admin-header">

          <div>
            <p className="admin-label">
              ADMIN PANEL
            </p>

            <h1>
              Create Chapter
            </h1>

            <p>
              Upload explanation, video, game and
              quiz content for a chapter.
            </p>
          </div>

          <button
            type="button"
            className="back-button"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>

        </div>

        {}
        {}
        {}

        {error && (
          <div className="message error-message">
            ❌ {error}
          </div>
        )}

        {}
        {}
        {}

        {message && (
          <div className="message success-message">
            ✅ {message}
          </div>
        )}

        {}
        {}
        {}

        <form
          className="chapter-form"
          onSubmit={handleSubmit}
        >

          {}
          {}
          {}

          <section className="admin-card">

            <div className="card-header">

              <div>
                <h2>
                  Chapter Information
                </h2>

                <p>
                  Enter the basic details of the
                  chapter.
                </p>
              </div>

            </div>

            {}

            <div className="form-group">
              <label>Education</label>

              <select
                name="educationId"
                value={form.educationId}
                onChange={handleEducationChange}
                disabled={loadingSubjects}
              >
                <option value="">
                  {loadingSubjects ? "Loading education..." : "Select Education"}
                </option>

                {educations.map((education) => (
                  <option key={education._id} value={education._id}>
                    {education.name}
                  </option>
                ))}
              </select>
            </div>

            {}

            {form.educationId && (
              <div className="form-group">
                <label>Course</label>

                <select
                  name="courseId"
                  value={form.courseId}
                  onChange={handleCourseChange}
                  disabled={loadingSubjects || !courses.length}
                >
                  <option value="">
                    {loadingSubjects
                      ? "Loading courses..."
                      : form.educationId && courses.length === 0
                        ? "No courses available"
                        : "Select Course"}
                  </option>

                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {}

            <div className="form-group">
              <label>Subject</label>

              <select
                name="subjectId"
                value={form.subjectId}
                onChange={handleChange}
                disabled={loadingSubjects || !subjects.length}
              >
                <option value="">
                  {loadingSubjects
                    ? "Loading subjects..."
                    : subjects.length === 0
                      ? "Select Education and Course first"
                      : "Select Subject"}
                </option>

                {subjects.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.name || subject.title || "Untitled subject"}
                  </option>
                ))}
              </select>
            </div>

            {}

            <div className="form-row">

              <div className="form-group">

                <label>
                  Chapter Number
                </label>

                <input
                  type="number"
                  name="chapterNumber"
                  min="1"
                  value={
                    form.chapterNumber
                  }
                  onChange={handleChange}
                  placeholder="1"
                />

              </div>

              <div className="form-group">

                <label>
                  Chapter Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Database Fundamentals"
                />

              </div>

            </div>

            {}

            <div className="form-group">

              <label>
                Description
              </label>

              <textarea
                name="description"
                value={
                  form.description
                }
                onChange={handleChange}
                placeholder="Write a short description of this chapter..."
                rows="4"
              />

            </div>

          </section>

          {}
          {}
          {}

          <section className="admin-card">

            <div className="card-header">

              <div>
                <h2>
                  Explanation
                </h2>

                <p>
                  Upload the complete explanation
                  folder.
                </p>
              </div>

            </div>

            <div className="upload-box">

              <h3>
                Select Explanation Folder
              </h3>

              <p>
                Include index.html, CSS, images
                and other assets.
              </p>

              <label className="upload-button">

                Choose Folder

                <input
                  type="file"
                  webkitdirectory=""
                  directory=""
                  multiple
                  onChange={
                    handleExplanationFiles
                  }
                />

              </label>

            </div>

            <FileList
              files={explanationFiles}
            />

          </section>

          {}
          {}
          {}

          <section className="admin-card">

            <div className="card-header">

              <div>
                <h2>
                  Video
                </h2>

                <p>
                  Upload the animated lesson
                  video.
                </p>
              </div>

            </div>

            <div className="upload-box">

              <h3>
                Select Video
              </h3>

              <p>
                MP4, WebM or OGG. Maximum 500 MB.
              </p>

              <label className="upload-button">

                Choose Video

                <input
                  type="file"
                  accept="video/mp4,video/webm,video/ogg"
                  onChange={
                    handleVideoFile
                  }
                />

              </label>

            </div>

            {videoFile && (
              <div className="selected-video">

                <div>

                  <strong>
                    {videoFile.name}
                  </strong>

                  <small>
                    {(
                      videoFile.size /
                      (1024 * 1024)
                    ).toFixed(2)}{" "}
                    MB
                  </small>

                </div>

              </div>
            )}

          </section>

          {}
          {}
          {}

          <section className="admin-card">

            <div className="card-header">

              <div>
                <h2>
                  Game
                </h2>

                <p>
                  Upload the complete game folder.
                </p>
              </div>

            </div>

            <div className="upload-box">

              <h3>
                Select Game Folder
              </h3>

              <p>
                Include index.html, JavaScript,
                CSS and assets.
              </p>

              <label className="upload-button">

                Choose Folder

                <input
                  type="file"
                  webkitdirectory=""
                  directory=""
                  multiple
                  onChange={
                    handleGameFiles
                  }
                />

              </label>

            </div>

            <FileList
              files={gameFiles}
            />

          </section>

          {}
          {}
          {}

          <section className="admin-card">

            <div className="card-header">

              <div>
                <h2>
                  Quiz
                </h2>

                <p>
                  Upload the complete quiz folder.
                </p>
              </div>

            </div>

            <div className="upload-box">

              <h3>
                Select Quiz Folder
              </h3>

              <p>
                Include index.html, JavaScript,
                CSS and assets.
              </p>

              <label className="upload-button">

                Choose Folder

                <input
                  type="file"
                  webkitdirectory=""
                  directory=""
                  multiple
                  onChange={
                    handleQuizFiles
                  }
                />

              </label>

            </div>

            <FileList
              files={quizFiles}
            />

          </section>

          {}
          {}
          {}

          <div className="submit-section">

            <button
              type="submit"
              className="submit-button"
              disabled={uploading}
            >

              {uploading ? "Uploading..." : "Upload Chapter"}

            </button>

            {uploading && (
              <p>
                Please don't close this page while
                the files are uploading.
              </p>
            )}

          </div>

        </form>

      </div>

    </div>
  );
}
