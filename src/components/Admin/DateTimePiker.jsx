import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import { useRef, useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const DateTimePicker = ({
  label,
  dateValue,
  timeValue,
  onDateChange,
  onTimeChange,
  index,
}) => {
  const popperRefs = useRef([]);
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      const isPopperClick = popperRefs.current.some(
        (ref) => ref && ref.contains(e.target),
      );

      if (!isPopperClick) {
        closeModal();
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const closeModal = () => setIsOpen(false);

const pickerTheme = createTheme({
  components: {
    MuiClock: {
      styleOverrides: {
        pin: {
          backgroundColor: "#b00bef",
        },
      },
    },
    MuiClockPointer: {
      styleOverrides: {
        root: {
          backgroundColor: "#b00bef",
        },
        thumb: {
          backgroundColor: "#ffffff",
          borderColor: "#b00bef",
        },
      },
    },
    
    MuiPickersCalendarHeader: {
      styleOverrides: {
        dayLabel: {
          color: "#cba6f7",
        },
      },
    },
  },
});

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ThemeProvider theme={pickerTheme}>
        <DatePicker
          label={`${label} Date`}
          value={dateValue}
          onChange={onDateChange}
          slotProps={{
            textField: {
              fullWidth: true,
              variant: "outlined",
              sx: {
                "& .MuiInputBase-input": { color: "white" },
                "& .MuiInputLabel-root": { color: "#cba6f7" },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#6528d7",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#b00bef",
                },
                "& .MuiSvgIcon-root": { color: "#cba6f7" },
              },
            },
            popper: {
              ref: (el) => (popperRefs.current[2 * index] = el),
              disablePortal: true,
              sx: {
                "& .MuiDayCalendar-weekDayLabel": {
                  color: "#b00bef",
                },
              },
            },
          }}
        />
        <TimePicker
          label={`${label} Time`}
          value={timeValue}
          onChange={onTimeChange}
          slotProps={{
            textField: {
              fullWidth: true,
              variant: "outlined",
              sx: {
                "& .MuiInputBase-input": { color: "white" },
                "& .MuiInputLabel-root": { color: "#cba6f7" },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#6528d7",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#b00bef",
                },
                "& .MuiSvgIcon-root": { color: "#cba6f7" },
              },
            },
            popper: {
              ref: (el) => (popperRefs.current[2 * index + 1] = el),
              disablePortal: true,
              
            },
          }}
          viewRenderers={{
            hours: renderTimeViewClock,
            minutes: renderTimeViewClock,
            seconds: renderTimeViewClock,
          }}
        />
      </ThemeProvider>
    </div>
  );
};

export default DateTimePicker;
