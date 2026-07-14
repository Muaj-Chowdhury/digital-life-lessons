import axios from "axios"

export const imageUpload = async imageData => {
  const formData = new FormData()
  formData.append('image', imageData)

  const { data } = await axios.post(
    `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
    formData
  )
  return data?.data?.display_url
}


export const saveOrUpdateUser = async (userData) =>{
    try{
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/users`, userData);
        return response.data;
    }
    catch(error){
        console.error("Error saving or updating user:", error);
        throw error;
    }
}