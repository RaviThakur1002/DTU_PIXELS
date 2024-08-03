import React from 'react'
import { useState, useEffect } from 'react'
import ContestServiceInstance from '../../firebase/contestServices/ContestService';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';

const styles = `
  @keyframes slideIn {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }
  @keyframes slideOut {
    from { transform: translateX(0); }
    to { transform: translateX(100%); }
  }
`;

const CreateContest = () => {
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [formData, setFormData] = useState({
    registrationEndDate: null,
    registrationEndTime: null,
    contestStartDate: null,
    contestStartTime: null,
    votingStartDate: null,
    votingStartTime: null,
    contestEndDate: null,
    contestEndTime: null,
    theme: '',
  });

  const setMessageWithTimer = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };


  useEffect(() => {
    const now = dayjs();
    const registrationEnd = now.add(3, 'day').startOf('day');
    const contestStart = registrationEnd.add(1, 'minute');
    const votingStart = contestStart.add(2, 'day').startOf('day');
    const contestEnd = votingStart.add(2, 'day').startOf('day');

    setFormData({
      registrationEndDate: registrationEnd,
      registrationEndTime: registrationEnd,
      contestStartDate: contestStart,
      contestStartTime: contestStart,
      votingStartDate: votingStart,
      votingStartTime: votingStart,
      contestEndDate: contestEnd,
      contestEndTime: contestEnd,
      theme: '',
    });
  }, []);

  const handleChange = (field, value) => {
    if (typeof field === 'string') {
      setFormData(prevState => {
        const newState = { ...prevState, [field]: value };
        return validateDates(newState, field);
      });
    } else {
      const { name, value } = field.target;
      setFormData(prevState => {
        const newState = { ...prevState, [name]: value };
        return validateDates(newState, name);
      });
    }
  }

  const validateDates = (newState, changedField) => {
    const fields = ['registrationEnd', 'contestStart', 'votingStart', 'contestEnd'];
    const index = fields.findIndex(field => changedField.startsWith(field));
    
    if (index > -1) {
      for (let i = index + 1; i < fields.length; i++) {
        const currentField = fields[i];
        const prevField = fields[i - 1];
        const currentDate = dayjs(`${newState[`${currentField}Date`].format('YYYY-MM-DD')} ${newState[`${currentField}Time`].format('HH:mm')}`);
        const prevDate = dayjs(`${newState[`${prevField}Date`].format('YYYY-MM-DD')} ${newState[`${prevField}Time`].format('HH:mm')}`);

        if (currentDate.isBefore(prevDate)) {
          newState[`${currentField}Date`] = prevDate;
          newState[`${currentField}Time`] = prevDate;
        }
      }
    }

    return newState;
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
      votingStartDate: formData.votingStartDate ? formData.votingStartDate.format('YYYY-MM-DD') : null,
      votingStartTime: formData.votingStartTime ? formData.votingStartTime.format('HH:mm') : null,
    };  
    
    try{
      const newContestId = await ContestServiceInstance.createContest(formattedData);
      console.log(formattedData);
      setMessageWithTimer(`Contest created with id ${newContestId}`, 'success');

      setFormData({
        registrationEndDate: null,
        registrationEndTime: null,
        contestStartDate: null,
        contestStartTime: null,
        votingStartDate: null,
        votingStartTime: null,
        contestEndDate: null,
        contestEndTime: null,
        theme: '',
      });    
    }
    catch(err){
      console.error(err);
      console.log(formData);
      setMessageWithTimer("Error creating Contest", 'error');
    }

  }    

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
        <style>{styles}</style>
      
        {/* Message display */}
        {message && (
          <div className={`fixed top-4 right-0 mb-4 p-3 rounded-l-lg w-64 ${
            messageType === 'success' 
              ? 'bg-gradient-to-r from-green-600 to-green-800 text-white' 
              : messageType === 'error'
              ? 'bg-gradient-to-r from-red-600 to-red-800 text-white'
              : 'bg-gradient-to-r from-blue-500 to-blue-700 text-white'
          } border border-solid ${
            messageType === 'success' ? 'border-green-500' : 
            messageType === 'error' ? 'border-red-500' : 'border-blue-400'
          } text-center transition-all duration-300 ease-in-out transform translate-x-0 shadow-md z-50`}
            style={{
              animation: `${message ? 'slideIn' : 'slideOut'} 0.3s ease-in-out forwards`
            }}
          >
            <p className="font-semibold">{message}</p>
          </div>
        )}

        <div className="w-full max-w-lg bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
            <h2 className="text-2xl font-bold text-white">Create New Contest</h2>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {[
              { label: "Registration End", dateKey: "registrationEndDate", timeKey: "registrationEndTime" },
              { label: "Contest Start", dateKey: "contestStartDate", timeKey: "contestStartTime" },
              { label: "Voting Start", dateKey: "votingStartDate", timeKey: "votingStartTime" },
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

