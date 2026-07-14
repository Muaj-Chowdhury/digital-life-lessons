import { useState } from "react";
import { Camera, X, Check, Loader2 } from "lucide-react";
import { imageUpload } from "../../../utils";
import { toast } from "react-toastify";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const EditProfileModal = ({ user, profile, onClose, refetch }) => {
  const [name, setName] = useState(profile?.name || "");
  const [photo, setPhoto] = useState(profile?.image || "");
  const [loading, setLoading] = useState(false);
  const axiosSecure = useAxiosSecure();

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const url = await imageUpload(file);
      setPhoto(url);
    } catch (error) {
      toast.error("Image upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await axiosSecure.patch(`/users/update-profile/${user.email}`, {
        name,
        image: photo,
      });

      toast.success("Identity Updated");
      refetch();
      onClose();
    } catch (error) {
      toast.error("Update failed. Try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-base-300/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
      
      <div className="bg-base-100 border border-base-300 rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden relative">
        {/* Header Decal */}
        <div className="h-2 bg-primary w-full opacity-20"></div>

        <div className="p-8 space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-black italic tracking-tighter text-base-content">
                Edit <span className="text-primary">Profile</span>
              </h3>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-40">User Identity Management</p>
            </div>
            <button onClick={onClose} className="btn btn-ghost btn-circle btn-sm">
              <X size={20} />
            </button>
          </div>

          {/* Avatar Upload Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <div className="mask mask-squircle w-32 h-32 bg-base-200 border-4 border-base-200 shadow-xl overflow-hidden">
                <img
                  src={photo || "https://via.placeholder.com/150"}
                  className={`w-full h-full object-cover transition-opacity ${loading ? 'opacity-40' : 'opacity-100'}`}
                  alt="Avatar Preview"
                />
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="animate-spin text-primary" size={32} />
                  </div>
                )}
              </div>
              
              <label className="absolute bottom-1 right-1 btn btn-primary btn-circle btn-sm shadow-lg cursor-pointer border-2 border-base-100">
                <Camera size={14} />
                <input type="file" className="hidden" onChange={handleImageChange} disabled={loading} />
              </label>
            </div>
            <p className="text-[9px] font-black uppercase opacity-30 tracking-tighter text-center leading-tight">
              Square aspect ratio<br/>recommended for squircles
            </p>
          </div>

          {/* Input Fields */}
          <div className="space-y-4">
            <div className="form-control w-full">
              <label className="label py-0 mb-1">
                <span className="label-text text-[10px] font-black uppercase opacity-50 tracking-widest">Display Name</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input input-bordered w-full bg-base-200/50 rounded-2xl focus:input-primary border-base-300 font-bold"
                placeholder="How should we call you?"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button 
              onClick={onClose} 
              className="btn flex-1 rounded-2xl font-black uppercase text-[10px] tracking-widest border-base-300 hover:bg-base-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="btn btn-primary flex-[2] rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20"
            >
              {loading ? <span className="loading loading-spinner loading-xs"></span> : <><Check size={14} /> Save Changes</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;