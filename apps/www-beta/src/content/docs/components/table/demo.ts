'use client';

export const preview = {
  type: 'code',
  code: `
    <Table>
    <Table.Header>
      <Table.Row>
        <Table.Head>Invoice</Table.Head>
        <Table.Head>Status</Table.Head>
        <Table.Head>Method</Table.Head>
        <Table.Head>Amount</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      <Table.Row>
        <Table.Cell>INV001</Table.Cell>
        <Table.Cell>Paid</Table.Cell>
        <Table.Cell>$250.00</Table.Cell>
        <Table.Cell>Credit Card</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>INV002</Table.Cell>
        <Table.Cell>Pending</Table.Cell>
        <Table.Cell>$150.00</Table.Cell>
        <Table.Cell>PayPal</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>INV003</Table.Cell>
        <Table.Cell>Unpaid</Table.Cell>
        <Table.Cell>$350.00</Table.Cell>
        <Table.Cell>Bank Transfer</Table.Cell>
      </Table.Row>
      <Table.SectionHeader colSpan={4}>Section 1</Table.SectionHeader>
      <Table.Row>
        <Table.Cell>INV001</Table.Cell>
        <Table.Cell>Paid</Table.Cell>
        <Table.Cell>$250.00</Table.Cell>
        <Table.Cell>Credit Card</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>INV002</Table.Cell>
        <Table.Cell>Pending</Table.Cell>
        <Table.Cell>$150.00</Table.Cell>
        <Table.Cell>PayPal</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>INV003</Table.Cell>
        <Table.Cell>Unpaid</Table.Cell>
        <Table.Cell>$350.00</Table.Cell>
        <Table.Cell>Bank Transfer</Table.Cell>
      </Table.Row>
      <Table.SectionHeader colSpan={4}>Section 2</Table.SectionHeader>
      <Table.Row>
        <Table.Cell>INV001</Table.Cell>
        <Table.Cell>Paid</Table.Cell>
        <Table.Cell>$250.00</Table.Cell>
        <Table.Cell>Credit Card</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>INV002</Table.Cell>
        <Table.Cell>Pending</Table.Cell>
        <Table.Cell>$150.00</Table.Cell>
        <Table.Cell>PayPal</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>INV003</Table.Cell>
        <Table.Cell>Unpaid</Table.Cell>
        <Table.Cell>$350.00</Table.Cell>
        <Table.Cell>Bank Transfer</Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table>`
};

export const basicDemo = {
  type: 'code',
  code: `
  <Table>
    <Table.Header>
      <Table.Row>
        <Table.Head>Invoice</Table.Head>
        <Table.Head>Status</Table.Head>
        <Table.Head>Method</Table.Head>
        <Table.Head>Amount</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      <Table.Row>
        <Table.Cell>INV001</Table.Cell>
        <Table.Cell>Paid</Table.Cell>
        <Table.Cell>$250.00</Table.Cell>
        <Table.Cell>Credit Card</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>INV001</Table.Cell>
        <Table.Cell>Paid</Table.Cell>
        <Table.Cell>$250.00</Table.Cell>
        <Table.Cell>Credit Card</Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table>
`
};
