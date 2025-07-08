import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
    ModalBody, ModalFooter, Button, FormControl, FormLabel, Input,
    Select, Grid, GridItem, Text, FormErrorMessage
} from "@chakra-ui/react";
import { RefObject } from "react";
import { UseFormRegister, FieldErrors, SubmitHandler } from "react-hook-form";
import { Livestock } from "../shedsTable";

export interface AnimalFormInputs {
    tag_id: string;
    name: string;
    date_of_birth?: string;
    animal_type?: string;
    breed?: string;
    gender?: string;
    health_status?: string;
    lactation?: string;
    shed_location: any;
    price?: number;
}

interface AnimalModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
    register: UseFormRegister<AnimalFormInputs>;
    errors: FieldErrors<AnimalFormInputs>;
    initialRef?: RefObject<HTMLInputElement>;
    finalRef?: RefObject<HTMLInputElement>;
    shedData: Livestock[];
    mode?: string;
    defaultValues?: AnimalFormInputs;
}

const AnimalModal: React.FC<AnimalModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    register,
    errors,
    initialRef,
    finalRef,
    mode,
    shedData,
    defaultValues
}) => {
    console.log("defaultValues", defaultValues);

    return (
        <Modal
            initialFocusRef={initialRef}
            finalFocusRef={finalRef}
            isOpen={isOpen}
            onClose={onClose}
            closeOnOverlayClick={false}
        >
            <ModalOverlay />
            <ModalContent minW="600px" maxW="600px" maxH="90vh" overflowY="auto">
                <ModalHeader>
                    {mode === 'edit' ? "Edit Animal" : "Add New Animal"}
                    <Text fontSize="14px">
                        Enter the details for the new animal. Click save when you're done.
                        {mode === 'edit'
                            ? "Update the animal details."
                            : " Enter the details for the new animal. Click save when you're done."}
                    </Text>
                </ModalHeader>

                <ModalCloseButton />
                <ModalBody pb={6}>
                    <form onSubmit={onSubmit}>
                        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                            <GridItem>
                                <FormControl isInvalid={errors.tag_id !== undefined}>
                                    <FormLabel>Tag Number</FormLabel>
                                    <Input
                                        placeholder="e.g. A-001"
                                        defaultValue={defaultValues?.tag_id}
                                        {...register("tag_id", { required: "Tag Number is required" })}
                                    />
                                    <FormErrorMessage>{errors.tag_id?.message}</FormErrorMessage>
                                </FormControl>
                            </GridItem>

                            <GridItem>
                                <FormControl isInvalid={errors.name !== undefined}>
                                    <FormLabel>Name</FormLabel>
                                    <Input
                                        placeholder="Animal name"
                                        defaultValue={defaultValues?.name}
                                        {...register("name", { required: "Name is required" })}
                                    />
                                    <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                                </FormControl>
                            </GridItem>

                            <GridItem>
                                <FormControl>
                                    <FormLabel>Date of Birth</FormLabel>
                                    <Input type="date"
                                        defaultValue={defaultValues?.date_of_birth} {...register("date_of_birth")} />
                                </FormControl>
                            </GridItem>

                            <GridItem>
                                <FormControl>
                                    <FormLabel>Animal Type</FormLabel>
                                    <Select placeholder="Select type" defaultValue={defaultValues?.animal_type} {...register("animal_type")}>
                                        <option value="cow">Cow</option>
                                        <option value="bull">Bull</option>
                                        <option value="heifer">Heifer</option>
                                        <option value="weaner">Weaner</option>
                                        <option value="calf">Calf</option>
                                    </Select>
                                </FormControl>
                            </GridItem>

                            <GridItem>
                                <FormControl>
                                    <FormLabel>Breed</FormLabel>
                                    <Input placeholder="e.g. Jersey, Holstein" defaultValue={defaultValues?.breed} {...register("breed")} />
                                </FormControl>
                            </GridItem>

                            <GridItem>
                                <FormControl>
                                    <FormLabel>Gender</FormLabel>
                                    <Select placeholder="Select gender" defaultValue={defaultValues?.gender} {...register("gender")}>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </Select>
                                </FormControl>
                            </GridItem>

                            <GridItem>
                                <FormControl>
                                    <FormLabel>Health Status</FormLabel>
                                    <Select placeholder="Select health status" defaultValue={defaultValues?.health_status} {...register("health_status")}>
                                        <option value="healthy">Healthy</option>
                                        <option value="sick">Sick</option>
                                        <option value="under-treatment">Under Treatment</option>
                                    </Select>
                                </FormControl>
                            </GridItem>

                            <GridItem>
                                <FormControl>
                                    <FormLabel>Lactation Status</FormLabel>
                                    <Select placeholder="Select lactation status" defaultValue={defaultValues?.lactation} {...register("lactation")}>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </Select>
                                </FormControl>
                            </GridItem>

                            <GridItem>
                                <FormControl isInvalid={errors.shed_location}>
                                    <FormLabel>Shed Location</FormLabel>
                                    <Select
                                        placeholder="Select Shed Location"
                                        defaultValue={defaultValues?.shed_location}
                                        {...register("shed_location", {
                                            required: "Shed Location is required",
                                        })}
                                    >
                                        {shedData.map((shed) => (
                                            <option key={shed.id} value={shed.id}>
                                                {shed.name}
                                            </option>
                                        ))}
                                    </Select>
                                    <FormErrorMessage>{errors.shed_location?.message}</FormErrorMessage>
                                </FormControl>

                            </GridItem>

                            <GridItem>
                                <FormControl>
                                    <FormLabel>Purchase Price</FormLabel>
                                    <Input type="number" defaultValue={defaultValues?.price} placeholder="e.g. 15000" {...register("price")} />
                                </FormControl>
                            </GridItem>
                        </Grid>

                        <ModalFooter>
                            <Button onClick={onClose} mr={3}>
                                Cancel
                            </Button>
                            <Button colorScheme="blue" type="submit">
                                {mode === 'edit' ? "Update Animal" : "Add Animal"}
                            </Button>
                        </ModalFooter>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default AnimalModal;
