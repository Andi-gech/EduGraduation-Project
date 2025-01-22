import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Api from "../utils/Api";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import IsLoading from "../Components/IsLoading";
import enUS from "date-fns/locale/en-US";
import { MdEvent } from "react-icons/md";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function Event() {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    eventname: "",
    eventdescription: "",
    eventStartDate: "",
    eventEndDate: "",
  });

  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("");
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const { data: events, isLoading, isError } = useQuery(["events"], async () => {
    const response = await Api.get("/events");
    return response.data.map((event) => ({
      ...event,
      start: new Date(event.StartDate),
      end: new Date(event.EndDate),
      title: event.name,
    }));
  });

  const addMutation = useMutation((newEvent) => Api.post("/events", newEvent), {
    onSuccess: () => {
      queryClient.invalidateQueries(["events"]);
      setMessage("Event added successfully!");
      setMessageType("success");
    },
    onError: () => {
      setMessage("Error adding event.");
      setMessageType("error");
    },
  });

  const deleteMutation = useMutation((id) => Api.delete(`/events/${id}`), {
    onSuccess: () => {
      queryClient.invalidateQueries(["events"]);
      setMessage("Event deleted successfully!");
      setMessageType("success");
    },
    onError: () => {
      setMessage("Error deleting event.");
      setMessageType("error");
    },
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedEvent) {
      // Update the existing event if editing
      addMutation.mutate(formData);
    } else {
      // Add a new event if none is selected
      addMutation.mutate(formData);
    }
    setFormData({
      eventname: "",
      eventdescription: "",
      eventStartDate: "",
      eventEndDate: "",
    });
    setOpenAdd(false);
    setOpenEdit(false);
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
    setSelectedEvent(null); // Clear the selected event after deletion
    setOpenEdit(false); // Close the edit modal after deletion
  };
  const handleClose = () => {
  setFormData({
    eventname: "",
    eventdescription: "",
    eventStartDate: "",
    eventEndDate: "",
  });
  setOpenAdd(false);
  setOpenEdit(false);
}

  const handleEventSelect = (event) => {
    setFormData({
      eventname: event?.title,
      eventdescription: event?.eventdescription,
      eventStartDate:  new Date(event.StartDate),
      eventEndDate: new Date(event.EndDate),
    });
    setSelectedEvent(event);
    setOpenEdit(true);
  };

  const handleEdit = (event) => {
    
    setOpenEdit(true);
  };

  if (isLoading) return <IsLoading />;
  if (isError)
    return (
      <div className="text-red-500 text-center">Error fetching events</div>
    );

  return (
    <div className="min-h-screen relative bg-white w-full m-6">
      <div className="flex justify-between items-center h-[70px] mb-8 bg-gradient-to-r from-white to-white p-4 rounded-xl shadow-zinc-100 shadow-md text-white">
        <div className="flex items-center">
          <MdEvent size={30} color="orange" />
          <h2 className="ml-4 text-2xl text-black font-bold">Event Calendar</h2>
        </div>
        <div
          className="flex items-center cursor-pointer bg-white shadow-sm p-4 rounded-md"
          onClick={() => setOpenAdd(true)}
        >
          <p className="text-sm text-black">Add New Event</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-col gap-6">
        <div className="bg-white rounded-lg shadow-md flex-1 w-full h-[80%]">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            eventPropGetter={(event) => ({
              style: {
                backgroundColor: "orange",
                color: "white",
                borderRadius: "4px",
                border: "none",
              },
            })}
            onSelectEvent={handleEventSelect} // Select event when clicked
          />
        </div>
      </div>

      {/* Add Event Modal */}
      {openAdd && (
        <div className="absolute w-full h-full top-0 bg-zinc-200 bg-opacity-[2%] backdrop-blur-[1px] z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-md flex-1 w-full max-w-[400px]">
            <h2 className="text-xl font-semibold mb-4">Add New Event</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Event Name</label>
                <input
                  type="text"
                  name="eventname"
                  value={formData.eventname}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Event Description</label>
                <textarea
                  name="eventdescription"
                  value={formData.eventdescription}
                  onChange={handleChange}
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <input
                  type="date"
                  name="eventStartDate"
                  value={formData.eventStartDate}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Date</label>
                <input
                  type="date"
                  name="eventEndDate"
                  value={formData.eventEndDate}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                  disabled={addMutation.isLoading}
                >
                  {addMutation.isLoading ? "Adding..." : "Add Event"}
                </button>
                <button
                  onClick={() => handleClose()}
                  className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {openEdit && selectedEvent && (
        <div className="absolute w-full h-full top-0 bg-zinc-200 bg-opacity-[2%] backdrop-blur-[1px] z-50 flex justify-center items-center">
          <div className="bg-white p-6  rounded-lg shadow-md flex-1 w-full max-w-[400px]">
            <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold mb-4">Edit Event</h2>
            <div onClick={
              handleClose
            } className="p-3 flex items-center justify-center ">
              <p className="text-lg font-semibold">X</p>
              </div>
              </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Event Name</label>
                <input
                  type="text"
                  name="eventname"
                  value={formData.eventname}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Event Description</label>
                <textarea
                  name="eventdescription"
                  value={formData.eventdescription}
                  onChange={handleChange}
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <input
                  type="date"
                  name="eventStartDate"
                  value={formData.eventStartDate}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Date</label>
                <input
                  type="date"
                  name="eventEndDate"
                  value={formData.eventEndDate}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                  disabled={addMutation.isLoading}
                >
                  {addMutation.isLoading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={()=>handleDelete(selectedEvent.id)}
                  className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
                >
                  Delete Event
                </button>
              </div>
            </form>
         
          </div>
        </div>
      )}

      {message && (
        <div
          className={`mt-4 p-4 rounded-lg ${
            messageType === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
