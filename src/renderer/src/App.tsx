import { Button, Space } from 'antd'
import { useEffect } from 'react';

function App(): JSX.Element {
  
  // calling the method in the useEffect to avoid subscribing multiple times
  useEffect(() => {
    window.api.subscribeStats((stats) => console.log(stats));
  }, []);

  const printStaticStats = async (): Promise<any> => {
    console.log(await window.api.getStaticData());
  };
  
  return (
    <>
      <Space direction="vertical" size={16}>
        <Button onClick={printStaticStats} type="primary">Button</Button>
      </Space>
    </>
  )
}

export default App
