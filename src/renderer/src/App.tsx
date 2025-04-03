import { Button, Space } from 'antd'

function App(): JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <>
      <Space direction="vertical" size={16}>
        <Button onClick={ipcHandle}>Click me</Button>
        <Button type="primary">Click me 2</Button>
      </Space>
    </>
  )
}

export default App
