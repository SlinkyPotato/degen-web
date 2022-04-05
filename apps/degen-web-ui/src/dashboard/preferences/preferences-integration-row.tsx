import { CheckCircleIcon } from '@chakra-ui/icons';
import { Box, Button, Heading, Text, Divider } from '@chakra-ui/react';

export interface PreferencesIntegrationRowProps {
  title: string;
  description?: string;
  linkText?: string;
  isLinked?: boolean;
  onLink?: () => any;
}

export const PreferencesIntegrationRow: React.FC<PreferencesIntegrationRowProps> = ({
  title,
  description,
  isLinked = false,
  linkText = 'Link',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onLink = () => {},
  children,
}) => {
  return (
    <>
      <Box className="col-span-12 flex flex-row justify-between my-4">
        <Box className="flex flex-col justify-center">
          <Box className="flex flex-row items-center">
            <Text>{title}</Text>
            {isLinked ? (
              <CheckCircleIcon
                className="ml-2"
                w={3}
                h={3}
                color="green.400"
              ></CheckCircleIcon>
            ) : (
              <></>
            )}
          </Box>
          <Text color="gray.500">{description}</Text>
        </Box>
        <Box className="flex flex-row items-center">
          {isLinked ? children : <Button onClick={onLink}>{linkText}</Button>}
        </Box>
      </Box>
      <Divider className="mb-5"></Divider>
    </>
  );
};
