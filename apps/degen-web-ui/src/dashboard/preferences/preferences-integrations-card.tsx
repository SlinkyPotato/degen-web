import { Box, Heading, Text, Divider } from '@chakra-ui/react';
import classNames from 'classnames';
import { BaseProps } from '../../core/interfaces/app-props.interface';
import { GridContainer } from '../../shared/components/layout/grid-container';

export interface PreferenceCardProps extends BaseProps {
  title: string;
  description?: string;
}

export const PreferenceCard: React.FC<PreferenceCardProps> = ({
  title,
  description,
  children,
  className,
}) => {
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
        <Box className="px-2 pb-1 col-span-12">
          <Divider></Divider>
          {children}
        </Box>
      </GridContainer>
    </Box>
  );
};
