import { useState } from "react";
import { FaCrown, FaSave, FaImage } from "react-icons/fa";
import { AiOutlineUnlock, AiOutlineClose } from "react-icons/ai";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { toast } from "react-toastify";
import { imageUpload } from "../../../utils";

const UpdateLessonModal = ({ lesson, onClose, refetch }) => {
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);

  // Form data initialized with existing lesson values
  const [formData, setFormData] = useState({
    title: lesson.title,
    description: lesson.description,
    category: lesson.category,
    tone: lesson.tone,
    accessLevel: lesson.accessLevel,
    image: lesson.image,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true);
      const imageUrl = await imageUpload(file);
      setFormData((prev) => ({ ...prev, image: imageUrl }));
      setLoading(false);
      toast.info("New image uploaded!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axiosSecure.patch(`/lessons/updateInfo/${lesson._id}`, formData);
      if (res.data.modifiedCount > 0 || res.data.matchedCount > 0) {
        toast.success("Lesson updated!");
        refetch();
        onClose();
      } else {
        toast.info("No changes detected");
        onClose();
      }
    } catch (err) {
      toast.error("Failed to update");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-base-100 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative">
        
        {/* Header */}
        <div className="p-6 border-b border-base-300 flex justify-between items-center bg-base-200/50">
          <h2 className="text-xl font-black italic">Update <span className="text-primary">Lesson</span></h2>
          <button onClick={onClose} className="btn btn-circle btn-ghost btn-sm"><AiOutlineClose size={20}/></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          
          <div className="form-control">
            <label className="label text-[10px] font-black uppercase opacity-40">Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input input-bordered rounded-xl bg-base-200 focus:input-primary"
              required
            />
          </div>

          <div className="form-control">
            <label className="label text-[10px] font-black uppercase opacity-40">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="textarea textarea-bordered rounded-xl bg-base-200 focus:textarea-primary min-h-[120px]"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label text-[10px] font-black uppercase opacity-40">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="select select-bordered rounded-xl bg-base-200">
                <option>Personal Growth</option>
                <option>Career</option>
                <option>Relationships</option>
                <option>Mindset</option>
                <option>Mistakes Learned</option>
              </select>
            </div>
            <div className="form-control">
              <label className="label text-[10px] font-black uppercase opacity-40">Tone</label>
              <select name="tone" value={formData.tone} onChange={handleChange} className="select select-bordered rounded-xl bg-base-200">
                <option>Motivational</option>
                <option>Sad</option>
                <option>Realization</option>
                <option>Gratitude</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-base-200 rounded-2xl">
            <span className="text-xs font-black uppercase opacity-50">Access Level</span>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, accessLevel: prev.accessLevel === 'premium' ? 'free' : 'premium' }))}
              className={`btn btn-sm rounded-xl gap-2 ${formData.accessLevel === 'premium' ? 'btn-warning' : 'btn-ghost bg-base-300'}`}
            >
              {formData.accessLevel === "premium" ? <FaCrown /> : <AiOutlineUnlock />}
              {formData.accessLevel}
            </button>
          </div>

          <div className="form-control">
            <label className="label text-[10px] font-black uppercase opacity-40">Featured Image</label>
            <div className="flex items-center gap-4">
              <img src={formData.image} className="w-24 h-24 rounded-2xl object-cover border-2 border-primary/20" alt="Preview" />
              <label className="btn btn-outline btn-sm rounded-xl gap-2">
                <FaImage /> Replace Image
                <input type="file" hidden onChange={handleImageChange} />
              </label>
            </div>
          </div>

          <button 
            disabled={loading} 
            className="btn btn-primary w-full rounded-2xl gap-2 shadow-lg shadow-primary/20"
          >
            {loading ? <span className="loading loading-spinner"></span> : <FaSave />}
            Update Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateLessonModal;