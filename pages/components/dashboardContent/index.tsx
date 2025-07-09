import {
  Box,
  Button,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import ShedLocationModal from "../shedLocationModal";
import ShedsTable from "../shedsTable";
import AnimalModal from "../animalModal";
import AnimalTable from "../animalTable";

const DashboardContent = () => {
  const baseUrl = "https://farm-management.outscalers.com/api";
  const token = "63|tftiy6qdBIen4DZj0d1LlFzX1w8H00uwLnsaowRsdec21faa";
  const [shedData, setShedData] = useState([]);
  const [animalsData, setAnimalsData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUrl}/v1/livestock/shedLocation`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // optional
          },
        });

        const result = await response.json();

        // assuming structure is: { data: { data: [...] } }
        if (result?.data?.data) {
          setShedData(result.data.data);
        } else {
          console.warn("Unexpected response structure:", result);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUrl}/v1/livestock/animals`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // optional
          },
        });

        const result = await response.json();

        // assuming structure is: { data: { data: [...] } }
        if (result?.data?.data) {
          setAnimalsData(result.data.data);
        } else {
          console.warn("Unexpected response structure:", result);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchData();
  }, []);
  console.log("shedData", shedData);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isAnimalOpen,
    onOpen: onAnimalOpen,
    onClose: onAnimalClose,
  } = useDisclosure();

  const {
    isOpen: isShedOpen,
    onOpen: onShedOpen,
    onClose: onShedClose,
  } = useDisclosure();

  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const {
    register: registerAnimal,
    handleSubmit: handleAnimalSubmit,
    formState: { errors: animalErrors },
    reset: resetAnimalForm,
  } = useForm();

  const onAnimalSubmit = async (data) => {
    console.log("Animal data:", data);
    try {
      const formData = new FormData();
      formData.append("tag_id", data.tag_id);
      formData.append("name", data.name);
      formData.append("animal_type", data.animal_type);
      formData.append("breed", data.breed);
      formData.append("gender", data.gender);
      formData.append(
        "date_of_birth",
        new Date(data.date_of_birth).toISOString()
      );
      formData.append("health_status", data.health_status);
      formData.append("lactation", data.lactation);
      formData.append("shed_location_id", String(data.shed_location));
      formData.append("price", String(data.price));
      console.log("formData", formData);
      console.log("orginal FormData content:");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ":", pair[1]);
      }
      const response = await fetch(`${baseUrl}/v1/livestock/animals`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Include token in header
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("API response:", result);
      if (!response.ok) {
        // 🧠 Show alert for 422 validation error
        if (response.status === 422 && result?.errors?.name?.length > 0) {
          alert(result.errors.name[0]); // Show the backend validation error in an alert box
        } else {
          console.error("Server error:", result.message);
          alert("An unexpected error occurred.");
        }
        return;
      }
      // Add the newly created item to your list
      if (result?.data) {
        setAnimalsData((prev) => [...prev, result.data]);
      }
      resetAnimalForm(); // Clear form
      onAnimalClose(); // Close modal if needed

      // Optionally update state/UI with result
    } catch (error) {
      console.error("Submission failed:", error.message);
      alert("Network error. Please try again.");
    }
  };
  console.log("Animal data sate:", animalsData);

  // 🔴 Location form setup
  const {
    register: registerLocation,
    handleSubmit: handleLocationSubmit,
    formState: { errors: locationErrors },
    reset,
  } = useForm({
    defaultValues: {
      status: "active",
    },
  });

  const onLocationSubmit = async (data) => {
    try {
      const response = await fetch(`${baseUrl}/v1/livestock/shedLocation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        // 🧠 Show alert for 422 validation error
        if (response.status === 422 && result?.errors?.name?.length > 0) {
          alert(result.errors.name[0]); // Show the backend validation error in an alert box
        } else {
          console.error("Server error:", result.message);
          alert("An unexpected error occurred.");
        }
        return;
      }

      if (result?.data) {
        setShedData((prev) => [...prev, result.data]);
      }

      reset(); // Clear form
      onShedClose(); // Close modal if needed
    } catch (error) {
      console.error("Submission failed:", error.message);
      alert("Network error. Please try again.");
    }
  };

  return (
    <Box w="100%">
      <Tabs w="100%">
        <TabList w="100%">
          <Tab w="100%">Dashboard</Tab>
          <Tab w="100%">
            Add Animals
          </Tab>
          <Tab w="100%">
            Add Sheds
          </Tab>
        </TabList>

        <TabPanels w="100%">
          <TabPanel>
            <p>Dashboard</p>
          </TabPanel>
          <TabPanel>
            <Button background="blue.900" onClick={onAnimalOpen} my={5}>
              Add Animals
            </Button>
            <AnimalTable
              animals={animalsData}
              shedData={shedData}
              setAnimalsData={setAnimalsData}
            />
          </TabPanel>
          <TabPanel>
            {/* table */}
            <Button background="blue.900" onClick={onShedOpen} my={5}>
              Add Sheds
            </Button>
            <ShedsTable shedData={shedData} setShedData={setShedData} />
          </TabPanel>
        </TabPanels>
      </Tabs>
      {/* Add Animals */}
      <AnimalModal
        isOpen={isAnimalOpen}
        onClose={onAnimalClose}
        onSubmit={handleAnimalSubmit(onAnimalSubmit)}
        register={registerAnimal}
        errors={animalErrors}
        shedData={shedData}
      />
      {/* add sheds */}
      <ShedLocationModal
        isOpen={isShedOpen}
        onClose={onShedClose}
        onSubmit={handleLocationSubmit(onLocationSubmit)}
        register={registerLocation}
        errors={locationErrors}
      />
    </Box>
  );
};

export default DashboardContent;
