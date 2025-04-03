import { Button, Space } from 'antd'
import { useEffect } from 'react';

function App(): JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  // calling the method in the useEffect to avoid subscribing multiple times
  useEffect(() => {
    // @ts-ignore
    window.api.subscribeStats((stats) => console.log(stats));
  }, []);

  const printStaticStats = (): void => {
    // @ts-ignore
    const stats = window.api.getStaticData()
    console.log(stats)
  };
  
  return (
    <>
      <Space direction="vertical" size={16}>
        <Button onClick={ipcHandle}>Click me</Button>
        <Button onClick={printStaticStats} type="primary">Click me 2</Button>
      </Space>
    </>
  )
}

export default App
