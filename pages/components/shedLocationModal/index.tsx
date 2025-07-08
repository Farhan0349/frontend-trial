import {
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Grid,
    GridItem,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Select,
    Text,
    Textarea,
} from '@chakra-ui/react';
import React, { RefObject } from 'react';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
export interface ShedLocationFormInputs {
    id?: string; // for editing
    name: string;
    description?: string;
    capacity: number;
    status: 'active' | 'inactive';
}

interface ShedLocationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
    register: UseFormRegister<ShedLocationFormInputs>;
    errors: FieldErrors<ShedLocationFormInputs>;
    initialRef?: RefObject<HTMLInputElement>;
    finalRef?: RefObject<HTMLInputElement>;
    mode?: string;
    defaultValues?: ShedLocationFormInputs;
}

const ShedLocationModal: React.FC<ShedLocationModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    register,
    errors,
    initialRef,
    finalRef,
    mode = 'add',
    defaultValues,
}) => {
    return (
        <Modal
            initialFocusRef={initialRef}
            finalFocusRef={finalRef}
            isOpen={isOpen}
            onClose={onClose}
            closeOnOverlayClick={false}
        >
            <ModalOverlay />
            <ModalContent minW={"600px"} maxW={"600px"} maxH={"90vh"} overflowY={"auto"}>
                <ModalHeader>
                    {mode === 'edit' ? "Edit Shed Location" : "Add Shed Location"}
                    <Text fontSize="14px">
                        {mode === 'edit'
                            ? "Update details for this shed or field location."
                            : "Enter a new shed or field location for your farm."}
                    </Text>
                </ModalHeader>
                <ModalCloseButton />

                <ModalBody pb={6}>
                    <form onSubmit={onSubmit}>
                        <Grid templateColumns="repeat(1, 1fr)" gap="6">
                            <GridItem>
                                <FormControl isInvalid={errors.name}>
                                    <FormLabel>Location Name</FormLabel>
                                    <Input
                                        placeholder="e.g. Barn D"
                                        defaultValue={defaultValues?.name}
                                        {...register("name", {
                                            required: "Name must be at least 2 characters",
                                            minLength: { value: 2, message: "Name must be at least 2 characters" },
                                        })}
                                    />
                                    <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                                </FormControl>
                            </GridItem>

                            <GridItem>
                                <FormControl>
                                    <FormLabel>Description</FormLabel>
                                    <Textarea
                                        placeholder="Description of location"
                                        defaultValue={defaultValues?.description}
                                        {...register("description")}
                                    />
                                </FormControl>
                            </GridItem>

                            <GridItem>
                                <FormControl isInvalid={errors.capacity}>
                                    <FormLabel>Capacity</FormLabel>
                                    <Input
                                        type="number"
                                        placeholder="Max number of animals"
                                        defaultValue={defaultValues?.capacity}
                                        {...register("capacity", {
                                            required: "Capacity must be at least 1",
                                            min: { value: 1, message: "Capacity must be at least 1" },
                                        })}
                                    />
                                    <FormErrorMessage>{errors.capacity?.message}</FormErrorMessage>
                                </FormControl>
                            </GridItem>

                            <GridItem>
                                <FormControl>
                                    <FormLabel>Status</FormLabel>
                                    <Select
                                        defaultValue={defaultValues?.status || "active"}
                                        {...register("status")}
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </Select>
                                </FormControl>
                            </GridItem>
                        </Grid>

                        <ModalFooter>
                            <Button onClick={onClose} mr={3}>
                                Cancel
                            </Button>
                            <Button colorScheme="blue" type="submit">
                                {mode === 'edit' ? "Update Location" : "Add Location"}
                            </Button>
                        </ModalFooter>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default ShedLocationModal;
