import { useRef, useState } from 'react'
import './App.css'
import {
  Button,
  Container,
  Group,
  Stepper,
  createStyles,
  Text,
  rem,
  useMantineTheme,
  Stack,
  ActionIcon,
  Tabs,
  Badge,
  TextInput,
  SimpleGrid,
  Checkbox,
  Center,
} from '@mantine/core'
import { Dropzone } from '@mantine/dropzone'
import { IconCloudUpload, IconX, IconDownload, IconFile, IconSearch, IconCheck } from '@tabler/icons-react'

const useStyles = createStyles((_theme) => ({
  wrapper: {
    marginTop: _theme.spacing.md,
    position: 'relative',
    marginBottom: rem('30px'),
  },

  dropzone: {
    borderWidth: rem('1px'),
    paddingBottom: rem('50px'),
  },

  icon: {
    color: 'light-dark(var(--mantine-color-gray-4), var(--mantine-color-dark-3))',
  },

  control: {
    position: 'absolute',
    width: rem('250px'),
    left: `calc(50% - ${rem('125px')})`,
    bottom: rem('-20px'),
  },
}))

const FIRST_ACTIVE = 0
const END_ACTIVE = 3

type EntityData = {
  pickLists: Array<string>
  objects: Array<string>
  actionMeta: Array<string>
  flows: Array<string>
  layouts: Array<string>
  applications: Array<string>
  appsLayouts: Array<string>
  objectsLayouts: Array<string>
  flowObjects: Array<string>
  profiles: Array<string>
}
type EntityType = keyof EntityData
type DataFile = Array<{
  entityType: EntityType
  data: any
}>

const TABS: Array<{ label: string; entityType: EntityType }> = [
  {
    entityType: 'applications',
    label: 'Applications',
  },
  {
    entityType: 'profiles',
    label: 'Profiles',
  },

  {
    entityType: 'actionMeta',
    label: 'Action Meta',
  },
  {
    entityType: 'objects',
    label: 'Object',
  },
  {
    entityType: 'flows',
    label: 'Flows',
  },
  {
    entityType: 'layouts',
    label: 'Layouts',
  },
  {
    entityType: 'pickLists',
    label: 'Pick Lists',
  },
]

const INIT_DATA = {
  pickLists: [],
  objects: [],
  actionMeta: [],
  flows: [],
  layouts: [],
  applications: [],
  appsLayouts: [],
  objectsLayouts: [],
  flowObjects: [],
  profiles: [],
}

function App() {
  const { classes } = useStyles()
  const theme = useMantineTheme()
  const [active, setActive] = useState(0)
  const [loading, setLoading] = useState(false)
  const [messageError, setMessageError] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current))
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current))

  const openRef = useRef<() => void>(null)
  const [data, setData] = useState<DataFile>([])
  const [entityData, setEntityData] = useState<EntityData>(INIT_DATA)

  const handlerClearFile = () => {
    setFile(null)
    openRef.current?.()
  }

  const handlerDropAndSelectFile = (file: File) => {
    setFile(file)
    const reader = new FileReader()
    reader.onload = (e: any) => {
      try {
        const contents = e?.target?.result

        const lines = contents
          .split('\n')
          .filter((line: string) => !!line)
          .map((line: string) => {
            return JSON.parse(`${line.trim().replace(`\r`, ``)}`)
          })
        setData(lines)
        setMessageError('')
      } catch (error) {
        setMessageError('File not supported!')
      }
    }
    reader.readAsText(file)
  }

  const handleConvertFile = (nameFile: string, data: string) => {
    const blob = new Blob([data], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.download = nameFile
    link.href = url
    link.click()
    URL.revokeObjectURL(url)
  }

  const handlerDownloadFileConvert = async () => {
    const resultObject: string[] = []
    setLoading(() => true)
    const dataConvert = {
      ...entityData,
      objectDetail: entityData.objects,
      flowDetail: entityData.flows,
    }
    data.forEach((line) => {
      const arr = dataConvert[`${line?.entityType}`] || dataConvert[`${line?.entityType}`]
      if (arr?.includes(line.data.name)) {
        resultObject.push(JSON.stringify(line))
      }
    })
    const outputName = `Convert_${file ? file.name : 'unknown.txt'}`
    handleConvertFile(outputName, resultObject.join('\n'))
    setLoading(() => false)
  }

  const handlerDone = () => {
    handlerClearFile()
    setEntityData(INIT_DATA)
    setActive(FIRST_ACTIVE)
  }

  const handlerSelectEntity = (checked: boolean, entityType: EntityType, name: string) => {
    let curListEntity = [...entityData[entityType]]
    if (!checked) {
      const index = curListEntity.indexOf(name)
      curListEntity.splice(index, 1)
    } else {
      curListEntity.push(name)
    }
    setEntityData((prev) => ({
      ...prev,
      [entityType]: curListEntity,
    }))
  }

  return (
    <Container>
      <Stack>
        <Stepper active={active} breakpoint="sm">
          <Stepper.Step label="First step" description="Upload File">
            <Stack>
              {messageError && (
                <Text fz="sm" color="red">
                  ERROR: {messageError}
                </Text>
              )}
              {file ? (
                <Group
                  pos="relative"
                  align="center"
                  spacing="xs"
                  mt="md"
                  bg="blue.4"
                  px="sm"
                  py="xs"
                  sx={{ cursor: 'pointer' }}
                >
                  <IconFile size={rem(26)} color="white" stroke={2} />
                  <Text color="white" fw={500}>
                    {file.name}
                  </Text>
                  <ActionIcon
                    pos="absolute"
                    color="red"
                    size="md"
                    variant="light"
                    right={-50}
                    onClick={handlerClearFile}
                  >
                    <IconX stroke={2} />
                  </ActionIcon>
                </Group>
              ) : (
                <div className={classes.wrapper}>
                  <Dropzone
                    loading={loading}
                    openRef={openRef}
                    onDrop={(files) => handlerDropAndSelectFile(files[0])}
                    onReject={(files) => console.log('rejected files', files)}
                    className={classes.dropzone}
                    radius="md"
                    maxFiles={1}
                    multiple={false}
                    accept={['text/plain']}
                    maxSize={30 * 1024 ** 2}
                  >
                    <div style={{ pointerEvents: 'none' }}>
                      <Group position="center">
                        <Dropzone.Accept>
                          <IconDownload
                            style={{ width: rem(50), height: rem(50) }}
                            color={theme.colors.blue[6]}
                            stroke={1.5}
                          />
                        </Dropzone.Accept>
                        <Dropzone.Reject>
                          <IconX style={{ width: rem(50), height: rem(50) }} color={theme.colors.red[6]} stroke={1.5} />
                        </Dropzone.Reject>
                        <Dropzone.Idle>
                          <IconCloudUpload style={{ width: rem(50), height: rem(50) }} stroke={1.5} />
                        </Dropzone.Idle>
                      </Group>

                      <Text ta="center" fw={700} fz="lg" mt="xl">
                        <Dropzone.Accept>Drop files here</Dropzone.Accept>
                        <Dropzone.Reject>text/plain file less than 30mb</Dropzone.Reject>
                        <Dropzone.Idle>Upload file</Dropzone.Idle>
                      </Text>
                      <Text ta="center" fz="sm" mt="xs" c="dimmed">
                        Drag&apos;n&apos;drop files here to upload. We can accept only <i>.txt</i> files that are less
                        than 30mb in size.
                      </Text>
                    </div>
                  </Dropzone>

                  <Button className={classes.control} size="md" radius="xl" onClick={() => openRef.current?.()}>
                    Select files
                  </Button>
                </div>
              )}
            </Stack>
          </Stepper.Step>
          <Stepper.Step label="Second step" description="Select Items">
            <Tabs defaultValue="applications">
              <Tabs.List>
                {TABS.map((tab) => (
                  <Tabs.Tab value={tab.entityType} key={tab.entityType}>
                    <Group spacing="xs">
                      {tab.label}
                      <Badge>{entityData[tab.entityType]?.length || 0}</Badge>
                    </Group>
                  </Tabs.Tab>
                ))}
              </Tabs.List>

              {TABS.map((tab) => (
                <Tabs.Panel value={tab.entityType} key={tab.entityType}>
                  <Stack mt="md">
                    <TextInput icon={<IconSearch size="1rem" />} placeholder="Search..." />
                    <PreviewShellData data={data} entityType={tab.entityType} onSelect={handlerSelectEntity} />
                  </Stack>
                </Tabs.Panel>
              ))}
            </Tabs>
          </Stepper.Step>
          <Stepper.Step label="Final step" description="Convert">
            {file && (
              <Group
                pos="relative"
                align="center"
                spacing="xs"
                mt="md"
                bg="cyan"
                px="sm"
                py="xs"
                sx={{ cursor: 'pointer' }}
              >
                <IconFile size={rem(26)} color="white" stroke={2} />
                <Text color="white" fw={500}>
                  {`Convert_${file.name}`}
                </Text>
                <ActionIcon
                  pos="absolute"
                  color="cyan"
                  size="md"
                  variant="light"
                  right={-50}
                  onClick={handlerDownloadFileConvert}
                >
                  <IconDownload stroke={2} />
                </ActionIcon>
              </Group>
            )}
          </Stepper.Step>
          <Stepper.Completed>
            <Center h={160}>
              <Group>
                <IconCheck color="green" />
                <Text color="gray.8">Completed, click back button to get to previous step</Text>
              </Group>
            </Center>
          </Stepper.Completed>
        </Stepper>

        <Group position="right" mt="xl">
          {active !== END_ACTIVE ? (
            <>
              <Button variant="default" onClick={prevStep} disabled={active === FIRST_ACTIVE}>
                Back
              </Button>
              <Button onClick={nextStep} disabled={!file || !!messageError}>
                Next step
              </Button>
            </>
          ) : (
            <Button onClick={handlerDone} disabled={!file}>
              Done
            </Button>
          )}
        </Group>
      </Stack>
    </Container>
  )
}

export default App

type PropType = {
  data: any[]
  entityType: EntityType
  onSelect: (checked: boolean, entityType: EntityType, name: string) => void
}

const PreviewShellData = ({ data, entityType, onSelect }: PropType) => {
  const curList = data.filter((item) => item?.entityType === entityType)
  return (
    <Stack>
      {curList.length > 0 ? (
        <>
          {curList.map((item, index) => (
            <SimpleGrid key={index}>
              <Checkbox
                onChange={(event) => onSelect(event.currentTarget.checked, entityType, item?.data?.name)}
                label={item?.data?.displayName || item?.data?.name}
              />
            </SimpleGrid>
          ))}
        </>
      ) : (
        <>
          <Center h={250}>
            <Text color="gray.5">No data available</Text>
          </Center>
        </>
      )}
    </Stack>
  )
}
