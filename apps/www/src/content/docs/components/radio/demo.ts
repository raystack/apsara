'use client';

export const preview = {
  type: 'code',
  code: `
  <Radio.Group defaultValue="2">
  <Flex direction="column" gap="small">
      <Flex gap="small" align="center">
          <Radio value="1" id="P1" />
          <label htmlFor="P1">Option One</label>
        </Flex>
        <Flex gap="small" align="center">
          <Radio value="2" id="P2" />
          <label htmlFor="P2">Option Two</label>
        </Flex>
        <Flex gap="small" align="center">
          <Radio value="3" id="P3" disabled/>
          <label htmlFor="P3">Option Three</label>
      </Flex>
    </Flex>
  </Radio.Group>`
};

export const stateDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Default',
      code: `
<Radio.Group defaultValue="1">
  <Flex gap="small" align="center">
    <Radio value="1" id="d1" />
    <label htmlFor="d1">Default Option</label>
  </Flex>
</Radio.Group>`
    },
    {
      name: 'Disabled',
      code: `
<Radio.Group defaultValue="1">
  <Flex gap="small" align="center">
    <Radio value="1" disabled id="dis1" />
    <label htmlFor="dis1">Disabled Option</label>
  </Flex>
</Radio.Group>`
    }
  ]
};

export const labelDemo = {
  type: 'code',
  code: `
  <Radio.Group defaultValue="1">
      <Flex gap="small" align="center">
        <Radio value="1" id="L1" />
        <label htmlFor="L1">Option One</label>
      </Flex>
      <Flex gap="small" align="center">
        <Radio value="2" id="L2" />
        <label htmlFor="L2">Option Two</label>
      </Flex>
      <Flex gap="small" align="center">
        <Radio value="3" id="L3" />
        <label htmlFor="L3">Option Three</label>
      </Flex>
  </Radio.Group>`
};

export const formDemo = {
  type: 'code',
  code: `
  <form onSubmit={(e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  alert(JSON.stringify(Object.fromEntries(formData)));
}}>
  <Flex direction="column" gap="medium">
    <Radio.Group name="plan" defaultValue="monthly">
      <Flex direction="column" gap="small">
        <Flex gap="small" align="center">
          <Radio value="monthly" id="mp" />
          <label htmlFor="mp">Monthly Plan</label>
        </Flex>
        <Flex gap="small" align="center">
          <Radio value="yearly" id="yp" />
          <label htmlFor="yp">Yearly Plan</label>
        </Flex>
      </Flex>
    </Radio.Group>
    <Button type="submit" width="100%">Submit</Button>
  </Flex>
</form>`
};
