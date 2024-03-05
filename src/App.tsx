import { ActionIcon, Avatar, Box, Group, Space, Stack, Text, Title, Tooltip } from '@mantine/core'
import './App.css'
import { modals } from '@mantine/modals'
import StepperApp from './components/StepperApp'
import { IconPlus } from '@tabler/icons-react'
import { useEffect } from 'react'

function App() {
  useEffect(() => {
    const curEnv = localStorage.getItem('curEnv')
    const assets = localStorage.getItem('@data/main')
  }, [])

  const openModalSelectEnv = () =>
    modals.open({
      title: 'Please confirm your action',
      children: <ModalAddEnv onClose={modals.close} />,
    })

  return (
    <Box>
      <Stack>
        <Group position="center" mb="sm">
          <Title>Export-Convert Tool</Title>
        </Group>
        <Group position="right" mb="sm" sx={{ cursor: 'pointer' }}>
          <Group
            spacing="sm"
            px={8}
            py={6}
            bg="gray.1"
            sx={(theme) => ({ borderRadius: theme.radius.sm })}
            onClick={openModalSelectEnv}
          >
            <Avatar radius={999} size="sm" color="blue">
              E
            </Avatar>
            <Text fw={500} fz="sm">
              Env Test
            </Text>
          </Group>
          <Tooltip label="Add env">
            <ActionIcon color="cyan" variant="light">
              <IconPlus />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Stack>
      <Space h="xl" />
      <StepperApp />
    </Box>
  )
}

export default App

type ModalAddEnvProps = {
  onClose: (payload_0: string) => void
}

const ModalAddEnv = ({}: ModalAddEnvProps) => {
  return (
    <Text size="sm">
      This action is so important that you are required to confirm it with a modal. Please click one of these buttons to
      proceed.
    </Text>
  )
}
