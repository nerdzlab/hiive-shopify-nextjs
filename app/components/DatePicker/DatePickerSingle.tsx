import {
  BlockStack,
  Box,
  Card,
  DatePicker,
  Icon,
  Popover,
  PopoverCloseSource,
  TextField,
} from "@shopify/polaris";
import { useEffect, useRef, useState } from "react";
import { CalendarIcon } from "@shopify/polaris-icons";

export function DatePickerSingle({
  onChange,
}: {
  onChange: (date: Date) => void;
}) {
  const [visible, setVisible] = useState(false);

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [{ month, year }, setDate] = useState({
    month: selectedDate.getMonth(),
    year: selectedDate.getFullYear(),
  });

  const formattedValue = selectedDate.toLocaleDateString().replaceAll("/", ".");

  function handleInputValueChange() {
    console.log("handleInputValueChange");
  }
  function handleOnClose(relatedTarget: PopoverCloseSource) {
    setVisible(false);
  }
  function handleMonthChange(month: number, year: number) {
    setDate({ month, year });
  }
  function handleDateSelection({ start: newSelectedDate }: { start: Date }) {
    setSelectedDate(newSelectedDate);
    setVisible(false);
    onChange && onChange(newSelectedDate);
  }

  useEffect(() => {
    if (selectedDate) {
      setDate({
        month: selectedDate.getMonth(),
        year: selectedDate.getFullYear(),
      });
    }
  }, [selectedDate]);

  return (
    <BlockStack inlineAlign="start">
      <Box>
        <Popover
          fluidContent={true}
          active={visible}
          autofocusTarget="none"
          preferredAlignment="left"
          fullWidth
          fullHeight
          preferInputActivator={false}
          preferredPosition="below"
          onClose={handleOnClose}
          activator={
            <TextField
              role="combobox"
              label="From"
              suffix={<Icon source={CalendarIcon} />}
              value={formattedValue}
              onFocus={() => setVisible(true)}
              onChange={handleInputValueChange}
              autoComplete="off"
            />
          }
        >
          <DatePicker
            month={month}
            year={year}
            disableDatesBefore={new Date(Date.now() - 86400000)}
            selected={selectedDate}
            onMonthChange={handleMonthChange}
            onChange={handleDateSelection}
          />
        </Popover>
      </Box>
    </BlockStack>
  );
}
