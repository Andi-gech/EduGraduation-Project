import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import SimpleTimeInput from 'react-simple-time-input';
import Api from '../utils/Api';

// Convert Ethiopian time (UTC+3) to UTC
const convertToUTC = (ethiopianTime) => {
  if (!ethiopianTime) return ''; // Handle empty values

  const [hours, minutes] = ethiopianTime.split(':').map(Number);

  
  const date = new Date(Date.UTC(1970, 0, 1, hours - 3, minutes)); // Subtract 3 hours for Ethiopian Time (UTC+3)
  

  return date.toISOString().slice(11, 16);
};

// Convert UTC time to Ethiopian time (UTC+3)
const convertToEthiopian = (utcTime) => {
  if (!utcTime) return ''; // Handle empty values

  const [hours, minutes] = utcTime.split(':').map(Number);

  // Create a Date object for 1970-01-01 with UTC time
  const date = new Date(Date.UTC(1970, 0, 1, hours, minutes)); // Use UTC as base
  date.setHours(date.getHours() + 3); // Convert to Ethiopian time (UTC+3)

  // Return the Ethiopian time as HH:mm format
  return date.toISOString().slice(11, 16);
};

const fetchMealTimes = async () => {
  const response = await Api.get('/cafe/MealTimes');
  return response.data;
};

const updateMealTimes = async (mealTimes) => {
  const response = await Api.post('/cafe/MealTimes', mealTimes);
  return response.data;
};

export default function CafeController() {
  const queryClient = useQueryClient();
  const { data: mealTimes, isLoading, isError } = useQuery(['mealTimes'], fetchMealTimes);
  const mutation = useMutation(updateMealTimes, {
    onSuccess: () => {
      queryClient.invalidateQueries(['mealTimes']);
    },
  });
  const [Trsesshold, setTrsesshold] = useState(0);

  const [newMealTimes, setNewMealTimes] = useState({
    breakfastStart: '',
    breakfastEnd: '',
    lunchStart: '',
    lunchEnd: '',
    dinnerStart: '',
    dinnerEnd: '',
  });

  // On component mount or when mealTimes are fetched, update the state with Ethiopian times
  useEffect(() => {
    if (mealTimes) {
      setNewMealTimes({
        breakfastStart: convertToEthiopian(mealTimes.breakfastStart),
        breakfastEnd: convertToEthiopian(mealTimes.breakfastEnd),
        lunchStart: convertToEthiopian(mealTimes.lunchStart),
        lunchEnd: convertToEthiopian(mealTimes.lunchEnd),
        dinnerStart: convertToEthiopian(mealTimes.dinnerStart),
        dinnerEnd: convertToEthiopian(mealTimes.dinnerEnd),
      });
    }
  }, [mealTimes]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewMealTimes((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert times to UTC before submitting
    const mealTimesInUTC = {
      breakfastStart: convertToUTC(newMealTimes.breakfastStart),
      breakfastEnd: convertToUTC(newMealTimes.breakfastEnd),
      lunchStart: convertToUTC(newMealTimes.lunchStart),
      lunchEnd: convertToUTC(newMealTimes.lunchEnd),
      dinnerStart: convertToUTC(newMealTimes.dinnerStart),
      dinnerEnd: convertToUTC(newMealTimes.dinnerEnd),
    };

    // Submit the meal times in UTC
    mutation.mutate(mealTimesInUTC);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading meal times</div>;

  return (
    <div className="p-4 overflow-y-scroll  flex flex-row">
      <div className="w-1/2">
      <h1 className="text-xl font-semibold mb-4">Update Cafe Payment </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
        <label className="block text-sm font-medium text-gray-700">
          Cafe Trsesshold
        </label>
        <input 
          type="number"
          value={newMealTimes.cafeThreshold}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        </div>
        <div>
          <button name='cafeThreshold' type="submit" disabled={mutation.isLoading} className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50">
            {mutation.isLoading ? 'Updating...' : 'Update Cafe Trsesshold'}
          </button>
        </div>
      </form>
      </div>
      <div className="w-1/2 px-4">
      
      <h1 className="text-xl font-semibold ">Update Meal Times</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {['breakfast', 'lunch', 'dinner'].map((meal) => (
          <div key={meal}>
            <label className="block text-sm font-medium text-gray-700">
              {meal.charAt(0).toUpperCase() + meal.slice(1)} Start Time (Ethiopian)
            </label>
            <SimpleTimeInput
              value={newMealTimes[`${meal}Start`]}
              clockMode={12}
              onValueChange={(value) => handleChange({ target: { name: `${meal}Start`, value } })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />

            <label className="block text-sm font-medium text-gray-700 mt-2">
              {meal.charAt(0).toUpperCase() + meal.slice(1)} End Time (Ethiopian)
            </label>
            <SimpleTimeInput
              value={newMealTimes[`${meal}End`]}
              clockMode={12}
              onValueChange={(value) => handleChange({ target: { name: `${meal}End`, value } })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        ))}
        <div>
          <button
            type="submit"
            disabled={mutation.isLoading}
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {mutation.isLoading ? 'Updating...' : 'Update Meal Times'}
          </button>
        </div>
      </form>
      </div>

      {mutation.isError && (
        <div className="mt-4 text-red-600">
          Error updating meal times: {mutation.error.message}
        </div>
      )}
      {mutation.isSuccess && (
        <div className="mt-4 text-green-600">Meal times updated successfully!</div>
      )}
    </div>
  );
}
