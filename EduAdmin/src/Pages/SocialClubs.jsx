import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import UseFetchclub from "../../hooks/UseFechClubs";
import Api from "../utils/Api";
import { RiTeamLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
export default function SocialClubs() {
  const { data: clubsData, isLoading: clubsLoading } = UseFetchclub();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  

  const [formData, setFormData] = useState({
    clubname: "",
    clubdescription: "",
  });

  const mutation = useMutation({
    mutationFn: async (newSocial) => {
      return await Api.post("/Social", newSocial);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("fechinactiveuser");
      setFormData({ clubname: "", clubdescription: "" });
    },
    onError: (error) => {
      console.error("Error creating social club:", error);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
   <div className="min-h-screen  bg-white w-full m-6 ">
      
         <div className="flex justify-between items-center h-[70px] mb-8 bg-gradient-to-r from-white to-white p-4 rounded-xl shadow-zinc-100 shadow-md text-white">
           <div className="flex items-center">
             <RiTeamLine size={30} color="orange" />
             <h2 className="ml-4 text-2xl text-black font-bold">Social Clubs</h2>
           </div>
         
         </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-white shadow-md rounded-md p-6 max-h-[70vh] overflow-y-auto">
          <h2 className="text-2xl font-semibold mb-4">Create a New Club</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="clubname" className="block font-medium mb-1">
                Club Name
              </label>
              <input
                type="text"
                id="clubname"
                name="clubname"
                value={formData.clubname}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
            <div>
              <label
                htmlFor="clubdescription"
                className="block font-medium mb-1"
              >
                Club Description
              </label>
              <textarea
                id="clubdescription"
                name="clubdescription"
                value={formData.clubdescription}
                onChange={handleChange}
                rows="4"
                className="w-full border border-gray-300 rounded-md p-2"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
              disabled={mutation.isLoading}
            >
              {mutation.isLoading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                  Creating...
                </div>
              ) : (
                "Create Club"
              )}
            </button>
            {mutation.isError && (
              <p className="text-red-500 text-center">
                Error: {mutation.error.message}
              </p>
            )}
          </form>
        </div>

        {/* Clubs List Section */}
        <div className="bg-white shadow-md rounded-md p-6 max-h-[70vh] overflow-y-auto">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Existing Clubs
          </h2>
          {clubsLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent border-t-4 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {clubsData?.data.map((club) => (
                <div
                  key={club._id}
                  className="border border-gray-300 rounded-md p-4 hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-lg font-bold mb-2">{club.clubname}</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {club.clubdescription}
                  </p>
                  <div className="flex justify-between">
                    <button onClick={
                      ()=>navigate(`/SocialClubs/${club._id}`)
                    } className="text-blue-600 font-medium hover:underline">
                      View Details
                    </button>
                    <button className="text-purple-600 font-medium hover:underline">
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
