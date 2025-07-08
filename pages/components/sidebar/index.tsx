'use client'

import React, { ReactNode, useState } from 'react'
import {
    IconButton,
    Box,
    CloseButton,
    Flex,
    Icon,
    useColorModeValue,
    Text,
    Drawer,
    DrawerContent,
    useDisclosure,
    BoxProps,
    FlexProps,
    Collapse,
    Image as ChakraImage
} from '@chakra-ui/react'
import {
    FiHome,
    FiTrendingUp,
    FiCompass,
    FiStar,
    FiSettings,
    FiMenu,
} from 'react-icons/fi'
import { IconType } from 'react-icons'
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon } from '@chakra-ui/icons'
import Image from 'next/image'
import DashboardContent from '../dashboardContent'
// import { ReactText } from 'react'

interface LinkItemProps {
    name: string;
    icon?: IconType; // for top-level (optional)
    iconImage?: string; // for image-based icons (children or all levels)
    children?: Array<{
        name: string;
        iconImage?: string;
        href?: string;
    }>;
}

const LinkItems: Array<LinkItemProps> = [
    {
        name: 'Overview',
        iconImage: '/icons/overview.png', // optional for top level
        children: [
            { name: 'Dashboard', iconImage: '/icons/dashboard.png', href: '/dashboard' },
        ],
    },
    {
        name: 'Form Management',
        iconImage: '/icons/overview.png',
        children: [
            { name: 'Forms List', iconImage: '/icons/dashboard.png', href: '/forms/list' },
            { name: 'Create Form', iconImage: '/icons/dashboard.png', href: '/forms/create' },
            { name: 'Categories', iconImage: '/icons/dashboard.png', href: '/forms/categories' },
        ],
    },
    {
        name: 'Explore',
        iconImage: '/icons/dashboard.png',
    },
    {
        name: 'Favourites',
        iconImage: '/icons/dashboard.png',
    },
    {
        name: 'Settings',
        iconImage: '/icons/dashboard.png',
    },
];


export default function Sidebar() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <>
            <Box
                position="fixed"
                top="0"
                left="0"
                h="100vh"
                w={isCollapsed ? '60px' : '240px'} // 60 = 240px in Chakra units
                transition="width 0.2s ease"
                overflow="hidden"
                bg={useColorModeValue('white', 'gray.900')}
                borderRight="1px solid"
                borderRightColor={useColorModeValue('gray.200', 'gray.700')}
                zIndex="1000"
            >
                <SidebarContent
                    onClose={onClose}
                    isCollapsed={isCollapsed}
                    setIsCollapsed={setIsCollapsed}
                    display={{ base: 'none', md: 'block' }}
                />
                {/* Floating toggle icon on the edge */}
                <IconButton
                    aria-label="Expand Sidebar"
                    icon={isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    position="fixed"
                    top="1rem"
                    left={isCollapsed ? '4.5rem' : '15.5rem'} // match 60 (expanded) or ~16 (collapsed)
                    zIndex="999"
                    size="sm"
                    borderRadius="full"
                    bg={useColorModeValue('white', 'gray.800')}
                    boxShadow="md"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                />

                <Drawer
                    isOpen={isOpen}
                    placement="left"
                    onClose={onClose}
                    returnFocusOnClose={false}
                    onOverlayClick={onClose}
                    size="full"
                >
                    <DrawerContent>
                        <SidebarContent
                            onClose={onClose}
                            isCollapsed={false}
                            setIsCollapsed={setIsCollapsed}
                        />
                    </DrawerContent>
                </Drawer>
                {/* mobilenav */}
                <MobileNav display={{ base: 'flex', md: 'none' }} onOpen={onOpen} />

            </Box>
            <Box ml={{ base: 0, md: isCollapsed ? '60px' : '240px' }} w={"100%"} transition="margin-left 0.2s ease-in-out" p="4">
                <DashboardContent />
            </Box>
        </>
    )
}

interface SidebarProps extends BoxProps {
    onClose: () => void;
    isCollapsed: boolean;
    setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}


const SidebarContent = ({ onClose, isCollapsed, setIsCollapsed, ...rest }: SidebarProps) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    return (
        <Box
            position="relative"
            top="0"
            left="0"
            h="100vh"
            w={isCollapsed ? 16 : 60}
            transition="width 0.2s ease"
            bg={useColorModeValue('white', 'gray.900')}
            borderRight="1px"
            borderRightColor={useColorModeValue('gray.200', 'gray.700')}
            overflow="hidden"
            zIndex="1000"
        >
            <Flex h="20" alignItems="center" mx="4" justifyContent={isCollapsed ? 'center' : 'space-between'}>
                {!isCollapsed && (
                    <Flex gap={4}>
                        <Flex w={"40px"} h={"40px"} borderRadius={"10px"} background="blue.900" justify={"center"} align={"center"}>
                            <Image
                                src="/farm-digits/logo.png"
                                width={24}
                                height={24}
                                style={{ width: "24px", height: "24px", objectFit: "contain" }}
                                alt="Picture of the author"
                            />
                        </Flex>
                        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
                            Logo
                        </Text>
                    </Flex>
                )}
                <IconButton
                    aria-label="Toggle Sidebar"
                    icon={isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    size="sm"
                    position="absolute"
                    top="1rem"
                    right="-30px" // 👈 Push outside the border
                    zIndex="1"
                    borderRadius="full"
                    bg={useColorModeValue('white', 'gray.800')}
                    boxShadow="md"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                />

            </Flex>
            {LinkItems.map((link, index) => {
                const isOpen = openIndex === index;

                return (
                    <Box key={link.name}>
                        <NavItem
                            iconImage={link.iconImage}
                            onClick={() =>
                                setOpenIndex(isOpen ? null : index)
                            }
                            hasDropdown={!!link.children}
                            isOpen={isOpen}
                            isCollapsed={isCollapsed} // ✅ pass this
                        >
                            {link.name}
                        </NavItem>

                        {link.children && !isCollapsed && ( // ✅ Only show dropdown when expanded
                            <Collapse in={isOpen} animateOpacity>
                                <Box pl="10" mt="1">
                                    {link.children.map((child) => (
                                        <NavItem
                                            key={child.name}
                                            iconImage={child.iconImage}
                                            isCollapsed={isCollapsed}
                                        >
                                            {child.name}
                                        </NavItem>
                                    ))}
                                </Box>
                            </Collapse>
                        )}
                    </Box>
                );
            })}



        </Box>
    );
};
interface NavItemProps extends FlexProps {
    iconImage?: string;
    children: React.ReactNode;
    onClick?: () => void;
    hasDropdown?: boolean;
    isOpen?: boolean;
    isCollapsed?: boolean;
}


const NavItem = ({
    iconImage,
    children,
    onClick,
    hasDropdown,
    isOpen,
    isCollapsed,
    ...rest
}: NavItemProps) => (
    <Box as="a" href="#" _focus={{ boxShadow: 'none' }} onClick={onClick}>
        <Flex
            align="center"
            justify="space-between"
            p="4"
            mx="4"
            borderRadius="lg"
            role="group"
            cursor="pointer"
            _hover={{
                bg: 'cyan.400',
                color: 'white',
            }}
            {...rest}
        >
            <Flex align="center">
                {iconImage && (
                    <ChakraImage
                        src={iconImage}
                        alt="icon"

                        style={{ marginRight: isCollapsed ? '0px' : '16px' }}
                    />
                )}

                {!isCollapsed && children}
            </Flex>

            {/* Chevron for dropdowns only when not collapsed */}
            {!isCollapsed && hasDropdown && (
                <Box>
                    {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                </Box>
            )}
        </Flex>
    </Box>
);



interface MobileProps extends FlexProps {
    onOpen: () => void
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
    return (
        <Flex
            ml={{ base: 0, md: 60 }}
            px={{ base: 4, md: 24 }}
            height="20"
            alignItems="center"
            bg={useColorModeValue('white', 'gray.900')}
            borderBottomWidth="1px"
            borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
            justifyContent="flex-start"
            {...rest}>
            <IconButton
                variant="outline"
                onClick={onOpen}
                aria-label="open menu"
                icon={<FiMenu />}
            />

            <Text fontSize="2xl" ml="8" fontFamily="monospace" fontWeight="bold">
                Logo
            </Text>
        </Flex>
    )
}