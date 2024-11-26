import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export default function Event() {
  const queryClient = useQueryClient();

  // Form state
  const [formData, setFormData] = useState({
    eventname: "",
    eventdescription: "",
    eventStartDate: "",
    eventEndDate: "",
  });

  // Fetch events
  const {
    data: events,
    isLoading,
    isError,
  } = useQuery(["events"], async () => {
    const response = await axios.get(
      "https://eduapi.senaycreatives.com/events"
    );
    return response.data;
  });

  // Mutation to add a new event
  const addMutation = useMutation(
    (newEvent) =>
      axios.post("https://eduapi.senaycreatives.com/events", newEvent),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["events"]); // Refresh events after a successful post
      },
    }
  );

  // Mutation to delete an event
  const deleteMutation = useMutation(
    (id) => axios.delete(`https://eduapi.senaycreatives.com/events/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["events"]); // Refresh events after a successful deletion
      },
    }
  );

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    addMutation.mutate(formData);
    setFormData({
      eventname: "",
      eventdescription: "",
      eventStartDate: "",
      eventEndDate: "",
    }); // Reset form fields
  };

  // Handle event deletion
  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  if (isLoading) return <div className="text-center p-4">Loading...</div>;
  if (isError)
    return (
      <div className="text-red-500 text-center">Error fetching events</div>
    );

  return (
    <div className="p-4 bg-white">
      <h1 className="text-2xl font-bold text-center mb-4">Events</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Events List */}
        <div>
          <ul className="space-y-2">
            {events.map((event) => (
              <li
                key={event._id}
                className="bg-white shadow-md rounded-lg p-3 flex justify-between items-center"
              >
                <span>
                  {event.eventname} -{" "}
                  {new Date(event.eventStartDate).toLocaleDateString()} to{" "}
                  {new Date(event.eventEndDate).toLocaleDateString()}
                </span>
                <button
                  onClick={() => handleDelete(event._id)}
                  disabled={deleteMutation.isLoading}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Event Form */}
        <div>
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-md rounded-lg p-4"
          >
            <input
              type="text"
              name="eventname"
              value={formData.eventname}
              onChange={handleChange}
              placeholder="Event Name"
              className="border border-gray-300 rounded-md p-2 mb-2 w-full"
              required
            />
            <textarea
              name="eventdescription"
              value={formData.eventdescription}
              onChange={handleChange}
              placeholder="Event Description"
              className="border border-gray-300 rounded-md p-2 mb-2 w-full"
            />
            <input
              type="date"
              name="eventStartDate"
              value={formData.eventStartDate}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 mb-2 w-full"
              required
            />
            <input
              type="date"
              name="eventEndDate"
              value={formData.eventEndDate}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 mb-4 w-full"
              required
            />
            <button
              type="submit"
              disabled={addMutation.isLoading}
              className="bg-blue-500 text-white rounded-md p-2 w-full hover:bg-blue-600"
            >
              {addMutation.isLoading ? "Adding..." : "Add Event"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
