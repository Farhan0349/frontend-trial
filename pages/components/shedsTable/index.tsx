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
    InputLeftElement
} from "@chakra-ui/react";
import React, { useState } from "react";
import ShedLocationModal, { ShedLocationFormInputs } from "../shedLocationModal";
import { useForm } from "react-hook-form";
import { ChevronDownIcon, PhoneIcon } from "@chakra-ui/icons";
import { LuSearch } from "react-icons/lu";

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
    const baseUrl = "https://farm-management.outscalers.com/api"
    const token = "63|tftiy6qdBIen4DZj0d1LlFzX1w8H00uwLnsaowRsdec21faa"
    const {
        isOpen: isUpdateShedOpen,
        onOpen: onUpdateShedOpen,
        onClose: onUpdateShedClose,
    } = useDisclosure();
    const [currentShed, setCurrentShed] = useState<ShedLocationFormInputs | null>(null);
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
            const response = await fetch(`${baseUrl}/v1/livestock/shedLocation/${currentShed.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(dataWithId),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log("API response:", result);

            if (result?.data) {
                // ✅ Update that shed in the array
                setShedData(prev =>
                    prev.map(shed => (shed.id === result.data.id ? result.data : shed))
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
        const confirmDelete = window.confirm("Are you sure you want to delete this shed?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`${baseUrl}/v1/livestock/shedLocation/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Remove from local state
            setShedData(prev => prev.filter(shed => shed.id !== id));
        } catch (error) {
            console.error("Error deleting shed:", error.message);
        }
    };

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");


    const filteredShedData = shedData.filter((shed) => {
        const matchesSearch = shed.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
            statusFilter === "All" || shed.status.toLowerCase() === statusFilter.toLowerCase();

        return matchesSearch && matchesStatus;
    });


    console.log("currentShed", currentShed);

    return (<>
        <Grid templateColumns={"repeat(4,1fr)"} gap={6} >
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
                        <MenuItem onClick={() => setStatusFilter("All")}>
                            <Button bg="none" _hover={{ bg: "none" }}>All</Button>
                        </MenuItem>
                        <MenuItem onClick={() => setStatusFilter("active")}>
                            <Button bg="none" _hover={{ bg: "none" }}>Active</Button>
                        </MenuItem>
                        <MenuItem onClick={() => setStatusFilter("inactive")}>
                            <Button bg="none" _hover={{ bg: "none" }}>Inactive</Button>
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
                    {filteredShedData.length > 0 ? (
                        filteredShedData.map((animal) => (
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
                </Tbody>
            </Table>
        </TableContainer>
        <ShedLocationModal
            isOpen={isUpdateShedOpen}
            onClose={onUpdateShedClose}
            onSubmit={handleShedUpdateSubmit(onShedUpdateSubmit)}
            register={registerLocation}
            errors={locationErrors}
            mode={'edit'}
            defaultValues={currentShed || undefined}
        />
    </>
    );
};

export default ShedsTable;
