import * as React from 'react';
import {
  Table,
  Tr,
  Thead,
  Th,
  Tbody,
  Td,
  Box,
  Text,
  Heading,
  Button,
  TableCaption,
} from '@chakra-ui/react';
import classNames from 'classnames';
import { BaseProps } from '../../core/interfaces/app-props.interface';
import { GridContainer } from '../../shared/components/layout/grid-container';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';

export interface AdminUser {
  name: string;
  userId: string;
  _id: string;
}

export interface AdminTableCardProps extends BaseProps {
  title: string;
  description?: string;
  users: AdminUser[];
  onAddUser?: () => any;
  onRemoveUser?: (userId: string) => any;
}

export default function AdminTableCard({
  title,
  description,
  users,
  onAddUser,
  onRemoveUser,
  className,
}: AdminTableCardProps) {
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      className={classNames(className, 'mb-12')}
    >
      <GridContainer>
        <Box className="px-2 py-6 col-span-12 md:col-span-10 lg:col-span-8">
          <Heading fontSize="xl" className="font-bold mb-2" as={Box}>
            {title}
          </Heading>
          <Text fontSize="md" color="gray.500" as={Box}>
            {description}
          </Text>
        </Box>
        {onAddUser ? (
          <Box className="px-2 py-6 col-span-12 md:col-span-2 lg:col-span-4 flex items-start justify-end">
            <Button onClick={onAddUser}>
              <AddIcon className="mr-2" />
              Add Admin
            </Button>
          </Box>
        ) : (
          <></>
        )}
      </GridContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>User</Th>
            {onRemoveUser ? <Th></Th> : <></>}
          </Tr>
        </Thead>
        <Tbody>
          {users.map((user, i) => (
            <Tr key={i}>
              <Td className="font-bold">{user?.name}</Td>
              {onRemoveUser ? (
                <Td className="text-right">
                  <Button onClick={() => onRemoveUser(user?._id)}>
                    <DeleteIcon className="mr-2" /> Remove
                  </Button>
                </Td>
              ) : (
                <></>
              )}
            </Tr>
          ))}
        </Tbody>
        {users?.length > 0 ? (
          <></>
        ) : (
          <TableCaption>
            <Text color="gray.500" className="mt-3 mb-6">
              No admins added yet
            </Text>
          </TableCaption>
        )}
      </Table>
    </Box>
  );
}
