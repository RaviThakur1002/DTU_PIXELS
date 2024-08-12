import { useState, useEffect, useRef } from "react";
import ContestServiceInstance from "../../firebase/contestServices/ContestService";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Modal from "./Modal";
import { ChevronRight, X } from "lucide-react";
import DateTimePicker from "./DateTimePiker";

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

export const CreateContest = () => {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    registrationEndDate: null,
    registrationEndTime: null,
    contestStartDate: null,
    contestStartTime: null,
    votingStartDate: null,
    votingStartTime: null,
    contestEndDate: null,
    contestEndTime: null,
    theme: "",
  });
  const modalRef = useRef(null);

  const setMessageWithTimer = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  
  useEffect(() => {
    const now = dayjs();
    const registrationEnd = now.add(3, "day").startOf("day");
    const contestStart = registrationEnd.add(1, "minute");
    const votingStart = contestStart.add(2, "day").startOf("day");
    const contestEnd = votingStart.add(2, "day").startOf("day");

    setFormData({
      registrationEndDate: registrationEnd,
      registrationEndTime: registrationEnd,
      contestStartDate: contestStart,
      contestStartTime: contestStart,
      votingStartDate: votingStart,
      votingStartTime: votingStart,
      contestEndDate: contestEnd,
      contestEndTime: contestEnd,
      theme: "",
    });
  }, []);

  const handleChange = (field, value) => {
    if (typeof field === "string") {
      setFormData((prevState) => {
        const newState = { ...prevState, [field]: value };
        return validateDates(newState, field);
      });
    } else {
      const { name, value } = field.target;
      setFormData((prevState) => {
        const newState = { ...prevState, [name]: value };
        return validateDates(newState, name);
      });
    }
  };

  const validateDates = (newState, changedField) => {
    const fields = [
      "registrationEnd",
      "contestStart",
      "votingStart",
      "contestEnd",
    ];
    const index = fields.findIndex((field) => changedField.startsWith(field));

    if (index > -1) {
      for (let i = index + 1; i < fields.length; i++) {
        const currentField = fields[i];
        const prevField = fields[i - 1];
        const currentDate = dayjs(
          `${newState[`${currentField}Date`].format("YYYY-MM-DD")} ${newState[`${currentField}Time`].format("HH:mm")}`,
        );
        const prevDate = dayjs(
          `${newState[`${prevField}Date`].format("YYYY-MM-DD")} ${newState[`${prevField}Time`].format("HH:mm")}`,
        );

        if (currentDate.isBefore(prevDate)) {
          newState[`${currentField}Date`] = prevDate;
          newState[`${currentField}Time`] = prevDate;
        }
      }
    }

    return newState;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedData = {
      ...formData,
      registrationEndDate: formData.registrationEndDate
        ? formData.registrationEndDate.format("YYYY-MM-DD")
        : null,
      registrationEndTime: formData.registrationEndTime
        ? formData.registrationEndTime.format("HH:mm")
        : null,
      contestStartDate: formData.contestStartDate
        ? formData.contestStartDate.format("YYYY-MM-DD")
        : null,
      contestStartTime: formData.contestStartTime
        ? formData.contestStartTime.format("HH:mm")
        : null,
      contestEndDate: formData.contestEndDate
        ? formData.contestEndDate.format("YYYY-MM-DD")
        : null,
      contestEndTime: formData.contestEndTime
        ? formData.contestEndTime.format("HH:mm")
        : null,
      votingStartDate: formData.votingStartDate
        ? formData.votingStartDate.format("YYYY-MM-DD")
        : null,
      votingStartTime: formData.votingStartTime
        ? formData.votingStartTime.format("HH:mm")
        : null,
    };

    try {
      const newContestId =
        await ContestServiceInstance.createContest(formattedData);
      setMessageWithTimer(`Contest created with id ${newContestId}`, "success");

      setFormData({
        registrationEndDate: null,
        registrationEndTime: null,
        contestStartDate: null,
        contestStartTime: null,
        votingStartDate: null,
        votingStartTime: null,
        contestEndDate: null,
        contestEndTime: null,
        theme: "",
      });
    } catch (err) {
      console.error(err);
      console.log(formData);
      setMessageWithTimer("Error creating Contest", "error");
    }
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

return (
    <>
      <button
        onClick={openModal}
        className="flex border-none outline-none items-center gap-3 px-4 py-3 text-md font-medium hover:bg-gray-600 hover:text-fuchsia-500 rounded-md transition-all duration-200 w-full text-left"
      >
        <ChevronRight className="h-5 w-5" />
        Create Contest
      </button>
      <Modal isOpen={isOpen} onClose={closeModal}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <style>{styles}</style>
          <div
            ref={modalRef}
            className="relative bg-gradient-to-b from-[#000000] via-[#171717] to-[#2c2c2e] rounded-lg shadow-xl w-full max-w-lg mx-auto overflow-y-auto max-h-[90vh] md:max-h-[80vh] text-white"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#6528d7] via-[#c638ab] to-[#b00bef] p-4 md:p-6 rounded-t-lg relative">
              <h2 className="text-2xl font-bold text-white">
                Create New Contest
              </h2>

              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 mt-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full p-1 md:p-2"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-6">
              {[
                {
                  label: "Registration End",
                  dateKey: "registrationEndDate",
                  timeKey: "registrationEndTime",
                },
                {
                  label: "Contest Start",
                  dateKey: "contestStartDate",
                  timeKey: "contestStartTime",
                },
                {
                  label: "Voting Start",
                  dateKey: "votingStartDate",
                  timeKey: "votingStartTime",
                },
                {
                  label: "Contest End",
                  dateKey: "contestEndDate",
                  timeKey: "contestEndTime",
                },
              ].map(({ label, dateKey, timeKey }, index) => (
                <DateTimePicker
                  key={label}
                  label={label}
                  dateValue={formData[dateKey]}
                  timeValue={formData[timeKey]}
                  onDateChange={(newValue) => handleChange(dateKey, newValue)}
                  onTimeChange={(newValue) => handleChange(timeKey, newValue)}
                  index={index}
                />
              ))}

              <div className="space-y-2">
                <label
                  htmlFor="theme"
                  className="block text-sm font-medium text-[#cba6f7]"
                >
                  Theme:
                </label>
                <input
                  id="theme"
                  type="text"
                  name="theme"
                  value={formData.theme}
                  onChange={(e) => handleChange("theme", e.target.value)}
                  required
                  className="mt-1 px-3 py-2 block w-full rounded-md bg-[#171717] border-[#6528d7] text-white focus:border-[#b00bef] focus:ring focus:ring-[#b00bef] focus:ring-opacity-50"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out text-lg font-semibold"
                >
                  Create Contest
                </button>
              </div>
            </form>
          </div>
          {/* Message display */}
          {message && (
            <div
              className={`fixed top-4 right-4 mb-4 p-4 rounded-lg w-64 ${
                messageType === "success"
                  ? "bg-green-500"
                  : messageType === "error"
                    ? "bg-red-500"
                    : "bg-blue-500"
              } text-white text-center shadow-lg z-50`}
              style={{
                animation: `${message ? "slideIn" : "slideOut"} 0.3s ease-in-out forwards`,
              }}
            >
              <p className="font-semibold">{message}</p>
            </div>
          )}
        </LocalizationProvider>
      </Modal>
    </>
  );
};

export default CreateContest;
