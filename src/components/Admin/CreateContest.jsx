import React from 'react'
import { useState } from 'react'
import ContestServiceInstance from '../../firebase/contestServices/ContestService';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';

const CreateContest = () => {

  const [formData, setFormData] = useState({
    registrationEndDate: null,
    registrationEndTime: null,
    contestStartDate: null,
    contestStartTime: null,
    contestEndDate: null,
    contestEndTime: null,
    theme: '',
  });

  const handleChange = (field, value) => {
    if (typeof field === 'string') {
      setFormData(prevState => ({
        ...prevState,
        [field]: value
      }));
    } else {
      const { name, value } = field.target;
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  }

  const handleSubmit = async (e) =>{
    e.preventDefault();
    const formattedData = {
      ...formData,
      registrationEndDate: formData.registrationEndDate ? formData.registrationEndDate.format('YYYY-MM-DD') : null,
      registrationEndTime: formData.registrationEndTime ? formData.registrationEndTime.format('HH:mm') : null,
      contestStartDate: formData.contestStartDate ? formData.contestStartDate.format('YYYY-MM-DD') : null,
      contestStartTime: formData.contestStartTime ? formData.contestStartTime.format('HH:mm') : null,
      contestEndDate: formData.contestEndDate ? formData.contestEndDate.format('YYYY-MM-DD') : null,
      contestEndTime: formData.contestEndTime ? formData.contestEndTime.format('HH:mm') : null,
    };  
    
    try{
      const newContestId = await ContestServiceInstance.createContest(formattedData);
      console.log(formattedData);
      alert(`Contest created with id ${newContestId}`);

      setFormData({
        registrationEndDate: null,
        registrationEndTime: null,
        contestStartDate: null,
        contestStartTime: null,
        contestEndDate: null,
        contestEndTime: null,
        theme: '',
      });    
    }
    catch(err){
      console.error(err);
      console.log(formData);
      alert("Error creating Contest");
    }

  }    

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
        <div className="w-full max-w-lg bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
            <h2 className="text-2xl font-bold text-white">Create New Contest</h2>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {[
              { label: "Registration End", dateKey: "registrationEndDate", timeKey: "registrationEndTime" },
              { label: "Contest Start", dateKey: "contestStartDate", timeKey: "contestStartTime" },
              { label: "Contest End", dateKey: "contestEndDate", timeKey: "contestEndTime" },
            ].map(({ label, dateKey, timeKey }) => (
              <div key={label} className="flex flex-col md:flex-row md:space-x-4">
                <div className="flex-1 space-y-2 pt-2">
                  <DatePicker
                    label={`${label} Date`}
                    value={formData[dateKey]}
                    onChange={(newValue) => handleChange(dateKey, newValue)}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </div>
                <div className="flex-1 space-y-2 pt-2">
                  <TimePicker
                    label={`${label} Time`}
                    value={formData[timeKey]}
                    onChange={(newValue) => handleChange(timeKey, newValue)}
                    slotProps={{ textField: { fullWidth: true } }}
                    viewRenderers={{
                      hours: renderTimeViewClock,
                      minutes: renderTimeViewClock,
                      seconds: renderTimeViewClock,
                    }}          
                  />
                </div>
              </div>
            ))}
            
            <div className="space-y-2">
              <label htmlFor="theme" className="block text-sm font-medium text-gray-700">Theme:</label>
              <input
                id="theme"
                type="text"
                name="theme"
                value={formData.theme}
                onChange={(e) => handleChange('theme', e.target.value)}
                required
                className="mt-1 px-1 block w-full rounded-md border-gray-300 shadow-md focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out"
              >
                Create Contest
              </button>
            </div>
          </form>
        </div>
      </div>
    </LocalizationProvider>
  );
}


export default CreateContest

