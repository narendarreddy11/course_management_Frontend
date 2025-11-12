import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Button, Spinner } from "react-bootstrap";
import api from "../Auth/api"; // ✅ Axios instance with interceptors

const ProfilePage = () => {
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [profileExists, setProfileExists] = useState(false);
  const [showForm, setShowForm] = useState(true); // ✅ Always show form for better UX

  const userId = sessionStorage.getItem("userid");

  // ✅ Load profile data (existing or empty)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/profile/${userId}`);

        // ✅ Even if backend sends empty object, reset form safely
        if (res.data) {
          reset({
            firstName: res.data.firstName || "",
            lastName: res.data.lastName || "",
            phone: res.data.phone || "",
            address: res.data.address || "",
            bio: res.data.bio || "",
          });

          if (res.data.profileImagePath) {
            setPreviewImage(`http://localhost:8080${res.data.profileImagePath}`);
          }

          // ✅ If it has ID → existing profile
          setProfileExists(!!res.data.id);
        } else {
          setProfileExists(false);
        }
      } catch (err) {
        console.warn("ℹ️ No profile found — using empty form.");
        setProfileExists(false);
        reset({
          firstName: "",
          lastName: "",
          phone: "",
          address: "",
          bio: "",
        });
      }
    };

    fetchProfile();
  }, [userId, reset]);

  // ✅ Handle image selection and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // ✅ Handle create or update submit
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const formData = new FormData();

      // ✅ Prepare JSON part for @RequestPart("profile")
      const profileBlob = new Blob(
        [
          JSON.stringify({
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone ? Number(data.phone) : 0, // convert to number safely
            address: data.address,
            bio: data.bio,
          }),
        ],
        { type: "application/json" }
      );

      formData.append("profile", profileBlob);

      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const url = `/profile/${userId}`;
      const method = profileExists ? api.put : api.post;

      const res = await method(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(profileExists ? "✅ Profile updated!" : "✅ Profile created!");
      setProfileExists(true);
      reset(res.data);

      if (res.data.profileImagePath) {
        setPreviewImage(`http://localhost:8080${res.data.profileImagePath}`);
      }
    } catch (error) {
      console.error("Profile save failed", error);
      toast.error("❌ Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div
        className="card shadow-lg p-4 mx-auto"
        style={{ maxWidth: "800px", borderRadius: "20px" }}
      >
        <h2 className="text-center mb-4 text-warning fw-bold">My Profile</h2>

        {/* 🟢 Always show form */}
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

        {/* Profile Form */}
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
                type="number"
                className="form-control"
                {...register("phone", { valueAsNumber: true })}
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
              {loading ? (
                <Spinner size="sm" animation="border" />
              ) : profileExists ? (
                "Update Profile"
              ) : (
                "Create Profile"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
