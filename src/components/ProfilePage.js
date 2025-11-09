import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Button, Spinner } from "react-bootstrap";
import api from "../Auth/api";
import { PencilSquare } from "react-bootstrap-icons";
import "react-toastify/dist/ReactToastify.css";

const ProfilePage = () => {
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const userId = sessionStorage.getItem("userid");

  // ✅ Fetch existing profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(`/profile/${userId}`);
        if (response?.data) {
          setProfileData(response.data);
          reset(response.data);
          if (response.data.profileImagePath) {
            setPreviewImage(
              `http://localhost:8080${response.data.profileImagePath}`
            );
          }
        }
      } catch (err) {
        console.log("ℹ️ No existing profile found yet.");
      }
    };
    if (userId) fetchProfile();
  }, [userId, reset]);

  // ✅ Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // ✅ Submit handler
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const formData = new FormData();

      // Profile JSON (matches @RequestPart("profile"))
      const profileBlob = new Blob(
        [
          JSON.stringify({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            phone: data.phone || "",
            address: data.address || "",
            bio: data.bio || "",
          }),
        ],
        { type: "application/json" }
      );

      formData.append("profile", profileBlob);
      if (selectedImage) formData.append("image", selectedImage);

      const response = await api.post(`/profile/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        setProfileData(response.data);
        if (response.data.profileImagePath) {
          setPreviewImage(
            `http://localhost:8080${response.data.profileImagePath}`
          );
        }
        toast.success("✅ Profile updated successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          pauseOnHover: true,
          theme: "colored",
        });
        setIsEditing(false);
      }
    } catch (error) {
      console.error("❌ Profile update failed:", error);
      const errMsg =
        error.response?.status === 403
          ? "🚫 Forbidden: Please login again."
          : "❌ Failed to update profile. Try again.";
      toast.error(errMsg, { position: "top-right", theme: "colored" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container py-5"
      style={{ backgroundColor: "#fff", borderRadius: "15px" }}
    >
      <div
        className="card shadow-lg p-4 mx-auto"
        style={{ maxWidth: "800px", borderRadius: "20px" }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="text-warning fw-bold m-0">My Profile</h2>
          {!isEditing && (
            <Button
              variant="light"
              className="shadow-sm border-0"
              onClick={() => setIsEditing(true)}
            >
              <PencilSquare className="me-2" />
              Edit
            </Button>
          )}
        </div>

        {/* Profile Image */}
        <div className="text-center mb-4">
          {previewImage ? (
            <img
              src={previewImage}
              alt="Profile"
              className="rounded-circle shadow-sm"
              style={{
                width: "150px",
                height: "150px",
                objectFit: "cover",
                border: "3px solid #ffc107",
              }}
            />
          ) : (
            <div
              className="bg-secondary d-inline-flex justify-content-center align-items-center rounded-circle"
              style={{
                width: "150px",
                height: "150px",
                color: "#fff",
                fontSize: "18px",
              }}
            >
              No Image
            </div>
          )}

          {isEditing && (
            <div className="mt-3 w-50 mx-auto">
              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={handleImageChange}
              />
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">First Name</label>
              <input
                type="text"
                className="form-control"
                {...register("firstName")}
                disabled={!isEditing}
                placeholder="Enter your first name"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Last Name</label>
              <input
                type="text"
                className="form-control"
                {...register("lastName")}
                disabled={!isEditing}
                placeholder="Enter your last name"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Phone</label>
              <input
                type="text"
                className="form-control"
                {...register("phone")}
                disabled={!isEditing}
                placeholder="Enter phone number"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Address</label>
              <input
                type="text"
                className="form-control"
                {...register("address")}
                disabled={!isEditing}
                placeholder="Enter address"
              />
            </div>
            <div className="col-12">
              <label className="form-label fw-semibold">Bio</label>
              <textarea
                className="form-control"
                rows="3"
                {...register("bio")}
                disabled={!isEditing}
                placeholder="Tell us about yourself..."
              ></textarea>
            </div>
          </div>

          {isEditing && (
            <div className="text-center mt-4">
              <Button
                variant="warning"
                type="submit"
                disabled={loading}
                className="px-4 shadow"
              >
                {loading ? (
                  <Spinner size="sm" animation="border" />
                ) : (
                  "Save Profile"
                )}
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
