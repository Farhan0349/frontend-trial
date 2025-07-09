import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Image as ChakraImage,
  useDisclosure,
  Grid,
  GridItem,
  Input,
  InputGroup,
  Kbd,
  InputLeftElement,
  Flex,
  Select,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import ShedLocationModal, {
  ShedLocationFormInputs,
} from "../shedLocationModal";
import { useForm } from "react-hook-form";
import { ChevronDownIcon, PhoneIcon } from "@chakra-ui/icons";
import { LuSearch } from "react-icons/lu";
import { GrPrevious, GrNext } from "react-icons/gr";
export interface Livestock {
  id: number;
  name: string;
  description: string;
  capacity: string;
  status: string;
}

interface ShedsTableProps {
  shedData: Livestock[];
  setShedData: React.Dispatch<React.SetStateAction<Livestock[]>>;
}

const ShedsTable: React.FC<ShedsTableProps> = ({ shedData, setShedData }) => {
  const baseUrl = "https://farm-management.outscalers.com/api";
  const token = "63|tftiy6qdBIen4DZj0d1LlFzX1w8H00uwLnsaowRsdec21faa";
  const {
    isOpen: isUpdateShedOpen,
    onOpen: onUpdateShedOpen,
    onClose: onUpdateShedClose,
  } = useDisclosure();
  const [currentShed, setCurrentShed] = useState<ShedLocationFormInputs | null>(
    null
  );
  const {
    register: registerLocation,
    handleSubmit: handleShedUpdateSubmit,
    formState: { errors: locationErrors },
    reset,
  } = useForm();
  const onShedUpdateSubmit = async (data: ShedLocationFormInputs) => {
    if (!currentShed?.id) {
      console.error("Missing shed ID for update");
      return;
    }

    const dataWithId = { ...data, id: currentShed.id }; // Attach ID manually

    try {
      const response = await fetch(
        `${baseUrl}/v1/livestock/shedLocation/${currentShed.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(dataWithId),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("API response:", result);

      if (result?.data) {
        // ✅ Update that shed in the array
        setShedData((prev) =>
          prev.map((shed) => (shed.id === result.data.id ? result.data : shed))
        );
      }

      reset(); // optional: clear form
      setCurrentShed(null); // clear selected shed
      onUpdateShedClose(); // close modal
    } catch (error) {
      console.error("Error updating shed location:", error.message);
    }
  };

  const onDeleteShed = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this shed?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${baseUrl}/v1/livestock/shedLocation/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Remove from local state
      setShedData((prev) => prev.filter((shed) => shed.id !== id));
    } catch (error) {
      console.error("Error deleting shed:", error.message);
    }
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const filteredShedData = shedData.filter((shed) => {
    const matchesSearch = shed.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" ||
      shed.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });



  const totalPages = Math.ceil(filteredShedData.length / rowsPerPage);

  const paginatedSheds = filteredShedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageClick = (pageNum) => {
    setCurrentPage(pageNum);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page
  };

  const renderPageNumbers = () => {
    const pageButtons = [];

    for (let i = 1; i <= totalPages; i++) {
      pageButtons.push(
        <Button
          key={i}
          size="sm"
          onClick={() => handlePageClick(i)}
          colorScheme={currentPage === i ? "blue" : "gray"}
          variant={currentPage === i ? "solid" : "outline"}
        >
          {i}
        </Button>
      );
    }

    return pageButtons;
  };


  return (
    <>
      <Grid templateColumns={"repeat(4,1fr)"} gap={6}>
        <GridItem>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <LuSearch color="gray.300" />
            </InputLeftElement>
            <Input
              type="text"
              placeholder="Search Sheds..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </GridItem>
        <GridItem>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              Filter By Status
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => setStatusFilter("All")}>All</MenuItem>
              <MenuItem onClick={() => setStatusFilter("active")}>
                Active
              </MenuItem>
              <MenuItem onClick={() => setStatusFilter("inactive")}>
                Inactive
              </MenuItem>
            </MenuList>
          </Menu>
        </GridItem>
      </Grid>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>

              <Th>Description</Th>
              <Th>Capacity</Th>
              <Th>Status</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedSheds.length > 0 ? (
              paginatedSheds.map((animal) => (
                <Tr key={animal.id}>
                  <Td>{animal.name}</Td>
                  <Td>{animal.description ? animal.description : "-"}</Td>
                  <Td>{animal.capacity}</Td>
                  <Td>{animal.status}</Td>
                  <Td>
                    <Menu>
                      <MenuButton as={Button} bg="none" _hover={{ bg: "none" }}>
                        <ChakraImage src="/icons/more-icon.png" />
                      </MenuButton>
                      <MenuList>
                        <MenuItem>View Details</MenuItem>
                        <MenuItem
                          onClick={() => {
                            setCurrentShed(animal);
                            onUpdateShedOpen();
                          }}
                        >
                          Edit
                        </MenuItem>
                        <MenuItem
                          onClick={() => onDeleteShed(animal.id)}
                          color="red"
                        >
                          Delete
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={8} textAlign="center">
                  No data found.
                </Td>
              </Tr>
            )}
            {filteredShedData.length > 0 && (
              <Tr>
                <Td colSpan={8}>
                  <Flex justify="space-between" align="center" px={4} flexWrap="wrap" gap={4}>
                    <Text fontSize={"sm"}>
                      Showing {Math.min((currentPage - 1) * rowsPerPage + 1, filteredShedData.length)} to{" "}
                      {Math.min(currentPage * rowsPerPage, filteredShedData.length)} of{" "}
                      {filteredShedData.length} results
                    </Text>

                    {/* Numbered Pagination */}
                    <Flex justify={"center"} gap={6}>
                      <Flex gap={2}>
                        {renderPageNumbers()}
                      </Flex> {/* Rows per page */}
                      <Flex align="center" gap={2}>
                        <span>Rows per page:</span>
                        <Select
                          value={rowsPerPage}
                          onChange={handleRowsPerPageChange}
                          width="80px"
                        >
                          <option value="5">5</option>
                          <option value="10">10</option>
                          <option value="15">15</option>
                        </Select>
                      </Flex>
                    </Flex>
                  </Flex>
                </Td>
              </Tr>
            )}

          </Tbody>
        </Table>
      </TableContainer>
      <ShedLocationModal
        isOpen={isUpdateShedOpen}
        onClose={onUpdateShedClose}
        onSubmit={handleShedUpdateSubmit(onShedUpdateSubmit)}
        register={registerLocation}
        errors={locationErrors}
        mode={"edit"}
        defaultValues={currentShed || undefined}
      />
    </>
  );
};

export default ShedsTable;
