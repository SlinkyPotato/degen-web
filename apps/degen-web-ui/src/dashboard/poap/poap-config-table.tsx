import {
  Table,
  TableCaption,
  Button,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from '@chakra-ui/react';
import * as React from 'react';
import { PoapAdminDTO } from '../../core/interfaces/poap-admin.dto';

export interface ConfigureTableProps {
  admins: PoapAdminDTO[];
}

export function PoapConfigTable({ admins }: ConfigureTableProps) {
  return (
    <Table className="col-span-full">
      <TableCaption>
        Add New Users <Button>Add</Button>
      </TableCaption>
      <Thead>
        <Tr>
          <Th>Name</Th>
          <Th>id</Th>
          <Th>Object Type</Th>
          <Th> Server Name </Th>
          <Th></Th>
        </Tr>
      </Thead>
      <Tbody>
        {admins &&
          admins.map((admin) => (
            <Tr key={admin.discordObjectId}>
              <Td>{admin.discordObjectName}</Td>
              <Td>{admin.discordObjectId}</Td>
              <Td>{admin.objectType}</Td>
              <Td>{admin.discordServerName}</Td>
              <Td>
                <Button colorScheme="red">Remove</Button>
              </Td>
            </Tr>
          ))}
      </Tbody>
    </Table>
  );
}
