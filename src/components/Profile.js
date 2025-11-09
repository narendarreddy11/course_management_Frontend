import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Button, Spinner } from "react-bootstrap";
import api from "../api"; // ✅ your Axios instance with interceptors

const ProfilePage = () => {
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [profileData, setProfileData] = useState(null);

  const userId = sessionStorage.getItem("userId");

  // ✅ Load existing profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(`/api/profile/${userId}`);
        setProfileData(response.data);
        reset(response.data);
        if (response.data.profileImagePath) {
          setPreviewImage(`http://localhost:8080${response.data.profileImagePath}`);
        }
      } catch (err) {
        console.log("No existing profile yet");
      }
    };
    fetchProfile();
  }, [userId, reset]);

  // ✅ Handle image selection + preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // ✅ Submit profile
  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const formData = new FormData();

      // 🔹 JSON part (must match @RequestPart("profile"))
      const profileBlob = new Blob(
        [
          JSON.stringify({
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            address: data.address,
            bio: data.bio,
          }),
        ],
        { type: "application/json" }
      );

      formData.append("profile", profileBlob);

      // 🔹 Image part
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const response = await api.post(`/api/profile/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("✅ Profile updated successfully!");
      setProfileData(response.data);
      if (response.data.profileImagePath) {
        setPreviewImage(`http://localhost:8080${response.data.profileImagePath}`);
      }
    } catch (error) {
      console.error("Profile update failed", error);
      toast.error("❌ Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="card shadow-lg p-4 mx-auto" style={{ maxWidth: "800px", borderRadius: "20px" }}>
        <h2 className="text-center mb-4 text-warning fw-bold">My Profile</h2>

        {/* Profile Image */}
        <div className="text-center mb-4">
          {previewImage ? (
            <img
              src={previewImage}
              alt="Profile"
              className="rounded-circle shadow"
              style={{ width: "150px", height: "150px", objectFit: "cover" }}
            />
          ) : (
            <div
              className="bg-secondary d-inline-block rounded-circle"
              style={{
                width: "150px",
                height: "150px",
                lineHeight: "150px",
                color: "#fff",
                fontSize: "20px",
              }}
            >
              No Image
            </div>
          )}
          <div className="mt-3">
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={handleImageChange}
            />
          </div>
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
                placeholder="Enter your first name"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Last Name</label>
              <input
                type="text"
                className="form-control"
                {...register("lastName")}
                placeholder="Enter your last name"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Phone</label>
              <input
                type="text"
                className="form-control"
                {...register("phone")}
                placeholder="Enter phone number"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Address</label>
              <input
                type="text"
                className="form-control"
                {...register("address")}
                placeholder="Enter address"
              />
            </div>
            <div className="col-12">
              <label className="form-label fw-semibold">Bio</label>
              <textarea
                className="form-control"
                rows="3"
                {...register("bio")}
                placeholder="Tell us about yourself..."
              ></textarea>
            </div>
          </div>

          <div className="text-center mt-4">
            <Button
              variant="warning"
              type="submit"
              disabled={loading}
              className="px-4 shadow"
            >
              {loading ? <Spinner size="sm" animation="border" /> : "Save Profile"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
