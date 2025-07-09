import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Button,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Image as ChakraImage,
    useDisclosure,
    Grid,
    GridItem,
    Input,
    InputGroup,
    InputLeftElement,
    Flex,
    Select,
    Text,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import React, { useEffect, useState } from "react";
import AnimalModal, { AnimalFormInputs } from "../animalModal";
import { useForm } from "react-hook-form";
import { Livestock } from "../shedsTable";
import { LuSearch } from "react-icons/lu";

// 🐮 Define the shape of animal data
export interface Animal {
    id: string;
    name: string;
    date_of_birth?: string;
    animal_type?: string;
    gender?: string;
    lactation?: string;
    health_status?: string;
    breed?: string;
    status?: string;
}

// 📦 Define props for the component
interface AnimalTableProps {
    animals: Animal[];
    shedData: Livestock[];
    setAnimalsData: React.Dispatch<React.SetStateAction<Animal[]>>;
}

const AnimalTable: React.FC<AnimalTableProps> = ({ animals, shedData, setAnimalsData }) => {
    const baseUrl = "https://farm-management.outscalers.com/api"
    const token = "63|tftiy6qdBIen4DZj0d1LlFzX1w8H00uwLnsaowRsdec21faa"
    const {
        isOpen: isUpdateAnimalOpen,
        onOpen: onUpdateAnimalOpen,
        onClose: onUpdateAnimalClose,
    } = useDisclosure();
    const [currentAnimal, setCurrentAnimal] = useState<AnimalFormInputs | null>(null);
    const {
        register: registerAnimal,
        handleSubmit: handleAnimalUpdateSubmit,
        formState: { errors: animalErrors },
        reset,
    } = useForm();


    const onAnimalUpdateSubmit = async (data: AnimalFormInputs) => {
        if (!currentAnimal?.id) {
            console.error("Missing animal ID for update");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("tag_id", data.tag_id);
            formData.append("name", data.name);
            formData.append("animal_type", data.animal_type);
            formData.append("breed", data.breed);
            formData.append("gender", data.gender);
            formData.append("date_of_birth", new Date(data.date_of_birth).toISOString());
            formData.append("health_status", data.health_status);
            formData.append("lactation", data.lactation);
            formData.append("shed_location_id", String(data.shed_location));
            formData.append("price", String(data.price));

            console.log("Updated formData entries:");
            for (let pair of formData.entries()) {
                console.log(pair[0] + ":", pair[1]);
            }

            const response = await fetch(`${baseUrl}/v1/livestock/animals/${currentAnimal?.id}`, {
                method: 'PUT', // or 'PATCH' based on API design
                headers: {
                    'Authorization': `Bearer ${token}`
                    // 'Content-Type' is NOT needed for FormData; browser sets it automatically
                },
                body: formData
            });

            const result = await response.json();

            if (!response.ok) {
                if (response.status === 422 && result?.errors?.name?.length > 0) {
                    alert(result.errors.name[0]);
                } else {
                    console.error("Update error:", result.message);
                    alert("Failed to update the animal.");
                }
                return;
            }

            // Optional: update local state if needed
            console.log("Update success:", result);
            alert("Animal updated successfully.");
            reset();

        } catch (error) {
            console.error("Update failed:", error.message);
            alert("Network error during update.");
        }
    };



    const onDeleteAnimal = async (id: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this shed?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`${baseUrl}/v1/livestock/animals/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Remove from local state
            setAnimalsData(prev => prev.filter(shed => shed.id !== id));
        } catch (error) {
            console.error("Error deleting shed:", error.message);
        }
    };

    const [searchTerm, setSearchTerm] = useState("");
    const [animalType, setAnimalType] = useState("all");      // default "all"
    const [healthStatus, setHealthStatus] = useState("all");
    const [animalStatus, setAnimalStatus] = useState("all");


    // const filteredAnimalsData = animals.filter((animal) => {
    //     const matchesSearch = animal.name.toLowerCase().includes(searchTerm.toLowerCase());
    //     const matchesStatus =
    //         statusFilter === "All" || animals.status.toLowerCase() === statusFilter.toLowerCase();

    //     return matchesSearch && matchesStatus;
    // });

    const fetchAnimals = async () => {
        try {
            const farmId = ""; // Add if available

            const buildQueryParams = (): string => {
                const params: Record<string, string> = {
                    farm_id: farmId,
                };

                if (animalType !== "all") {
                    params.animal_type = animalType;
                }

                if (healthStatus !== "all") {
                    params.health_status = healthStatus;
                }

                if (animalStatus !== "all") {
                    params.status = animalStatus;
                }

                if (searchTerm.trim()) {
                    params.search = searchTerm.trim();
                }

                return new URLSearchParams(params).toString();
            };

            const query = buildQueryParams();
            const response = await fetch(`${baseUrl}/v1/livestock/animals?${query}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const result = await response.json();
            console.log("result-------", result);

            setAnimalsData(result?.data.data || []);
        } catch (error) {
            console.error("Error fetching animals:", error.message);
        }
    };



    useEffect(() => {
        fetchAnimals();
    }, [searchTerm, animalType, healthStatus, animalStatus]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const totalPages = Math.ceil(animals.length / rowsPerPage);

    const paginatedAnimals = animals.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleRowsPerPageChange = (e) => {
        setRowsPerPage(Number(e.target.value));
        setCurrentPage(1); // reset to first page
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


    return (<>
        <Flex gap={2}>
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
                        {animalType === "all" ? "Filter By Type" : `Type: ${animalType}`}
                    </MenuButton>
                    <MenuList>
                        {["all", "cow", "bull", "heifer", "weaner", "calf"].map(type => (
                            <MenuItem key={type} onClick={() => setAnimalType(type)}>
                                {type === "all" ? "All" : type.charAt(0).toUpperCase() + type.slice(1)}
                            </MenuItem>
                        ))}
                    </MenuList>
                </Menu>
            </GridItem>

            <GridItem>
                <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                        {healthStatus === "all" ? "Filter By Health" : `Health: ${healthStatus}`}
                    </MenuButton>
                    <MenuList>
                        {["all", "healthy", "sick", "under-treatment"].map(status => (
                            <MenuItem key={status} onClick={() => setHealthStatus(status)}>
                                {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
                            </MenuItem>
                        ))}
                    </MenuList>
                </Menu>
            </GridItem>

            <GridItem>
                <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                        {animalStatus === "all" ? "Filter By Status" : `Status: ${animalStatus}`}
                    </MenuButton>
                    <MenuList>
                        {["all", "active", "pregnant", "dry", "sold", "deceased"].map(status => (
                            <MenuItem key={status} onClick={() => setAnimalStatus(status)}>
                                {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
                            </MenuItem>
                        ))}
                    </MenuList>
                </Menu>
            </GridItem>

        </Flex >
        <TableContainer>
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>Name</Th>
                        <Th>Date of Birth</Th>
                        <Th>Animal Type</Th>
                        <Th>Gender</Th>
                        <Th>Status</Th>
                        <Th>Health Status</Th>
                        <Th>Breed</Th>
                        <Th>Action</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {paginatedAnimals.length > 0 ? (
                        paginatedAnimals.map((animal) => (
                            <Tr key={animal.id}>
                                <Td>{animal.name}</Td>
                                <Td>{animal.date_of_birth || "-"}</Td>
                                <Td>{animal.animal_type || "-"}</Td>
                                <Td>{animal.gender || "-"}</Td>
                                <Td>{animal.lactation || "-"}</Td>
                                <Td>{animal.health_status || "-"}</Td>
                                <Td>{animal.breed || "-"}</Td>
                                <Td>
                                    <Menu>
                                        <MenuButton as={Button} bg="none" _hover={{ bg: "none" }}>
                                            <ChakraImage src="/icons/more-icon.png" />
                                        </MenuButton>
                                        <MenuList>
                                            <MenuItem>View Details</MenuItem>
                                            <MenuItem onClick={() => {
                                                setCurrentAnimal(animal);
                                                onUpdateAnimalOpen();
                                            }}>Edit</MenuItem>
                                            <MenuItem color="red" onClick={() => onDeleteAnimal(animal.id)}>
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
                                No animal data found.
                            </Td>
                        </Tr>
                    )}

                    {/* Pagination Footer */}
                    {animals.length > 0 && (
                        <Tr>
                            <Td colSpan={8}>
                                <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
                                    <Text fontSize={"sm"} color={"#A3A3A3"}>  Showing {Math.min((currentPage - 1) * rowsPerPage + 1, animals.length)} to{" "}
                                        {Math.min(currentPage * rowsPerPage, animals.length)} of{" "}
                                        {animals.length} results</Text>
                                    {/* Numbered page buttons */}
                                    <Flex align={"center"} gap={6}>
                                        <Flex gap={2}>
                                            {renderPageNumbers()}
                                        </Flex>
                                        {/* Rows per page */}
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
        </TableContainer >
        <AnimalModal
            isOpen={isUpdateAnimalOpen}
            onClose={onUpdateAnimalClose}
            onSubmit={handleAnimalUpdateSubmit(onAnimalUpdateSubmit)}
            register={registerAnimal}
            errors={animalErrors}
            shedData={shedData}
            mode={'edit'}
            defaultValues={currentAnimal || undefined}
        />
    </>
    );
};

export default AnimalTable;
