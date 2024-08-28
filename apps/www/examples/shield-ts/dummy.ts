export type Payment = {
    id: string;
    amount: number;
    status: "pending" | "processing" | "success" | "failed";
    email: string;
    created_at: string;
  };

const dummyData: Payment[] = [
    {
      id: "m5gr84i9",
      amount: 316,
      status: "success",
      email: "ken99@yahoo.com",
      created_at: "2023-10-10T13:02:56.12Z",
    },
    {
      id: "3u1reuv4",
      amount: 242,
      status: "success",
      email: "Abe45@gmail.com",
      created_at: "2023-09-15T11:55:46.28Z",
    },
    {
      id: "derv1ws0",
      amount: 837,
      status: "processing",
      email: "Monserrat44@gmail.com",
      created_at: "2023-07-01T10:02:50.60Z",
    },
    {
      id: "5kma53ae",
      amount: 874,
      status: "success",
      email: "Silas22@gmail.com",
      created_at: "2023-05-30T09:02:26.49Z",
    },
    {
      id: "bhqecj4p",
      amount: 721,
      status: "failed",
      email: "carmella@hotmail.com",
      created_at: "2024-04-20T21:02:01.25Z",
    },
    {
      id: "qwe123rt",
      amount: 543,
      status: "pending",
      email: "john.doe@example.com",
      created_at: "2023-11-05T14:30:22.75Z",
    },
    {
      id: "asd456fg",
      amount: 962,
      status: "success",
      email: "jane.smith@example.com",
      created_at: "2023-12-18T08:45:33.90Z",
    },
    {
      id: "zxc789vb",
      amount: 195,
      status: "failed",
      email: "bob.johnson@example.com",
      created_at: "2024-01-22T17:20:11.35Z",
    },
    {
      id: "poi098uy",
      amount: 678,
      status: "processing",
      email: "alice.williams@example.com",
      created_at: "2023-08-07T11:10:55.80Z",
    },
    {
      id: "lkj456nm",
      amount: 389,
      status: "success",
      email: "charlie.brown@example.com",
      created_at: "2023-06-14T09:05:44.15Z",
    },
    {
      id: "mnb678vc",
      amount: 752,
      status: "pending",
      email: "diana.clark@example.com",
      created_at: "2024-02-29T22:40:38.60Z",
    },
    {
      id: "fgh234jk",
      amount: 506,
      status: "success",
      email: "edward.white@example.com",
      created_at: "2023-10-03T16:15:27.95Z",
    },
    {
      id: "tyu567io",
      amount: 841,
      status: "failed",
      email: "fiona.green@example.com",
      created_at: "2024-03-11T13:50:16.30Z",
    },
    {
      id: "rty789op",
      amount: 273,
      status: "processing",
      email: "george.taylor@example.com",
      created_at: "2023-09-25T19:35:05.70Z",
    },
    {
      id: "bnm345kl",
      amount: 697,
      status: "success",
      email: "hannah.miller@example.com",
      created_at: "2023-07-19T12:25:49.85Z",
    },
    {
      id: "qaz123ws",
      amount: 529,
      status: "pending",
      email: "ian.roberts@example.com",
      created_at: "2024-01-07T10:15:33.40Z",
    },
    {
      id: "edc456rf",
      amount: 915,
      status: "success",
      email: "julia.adams@example.com",
      created_at: "2023-11-30T18:20:55.20Z",
    },
    {
      id: "tgb789yh",
      amount: 184,
      status: "failed",
      email: "kevin.martin@example.com",
      created_at: "2024-02-14T07:45:22.75Z",
    },
    {
      id: "ujm098ik",
      amount: 763,
      status: "processing",
      email: "laura.thompson@example.com",
      created_at: "2023-08-22T14:30:11.90Z",
    },
    {
      id: "vfr456bgt",
      amount: 438,
      status: "success",
      email: "michael.davis@example.com",
      created_at: "2023-06-29T11:55:44.60Z",
    },
    {
      id: "cde345vfr",
      amount: 602,
      status: "pending",
      email: "natalie.wilson@example.com",
      created_at: "2024-03-25T20:10:38.15Z",
    },
    {
      id: "bhu678nm",
      amount: 357,
      status: "success",
      email: "oliver.jackson@example.com",
      created_at: "2023-10-18T15:40:27.30Z",
    },
    {
      id: "nji890mko",
      amount: 896,
      status: "failed",
      email: "patricia.lee@example.com",
      created_at: "2024-04-02T09:25:16.85Z",
    },
    {
      id: "olk098plo",
      amount: 231,
      status: "processing",
      email: "quentin.harris@example.com",
      created_at: "2023-09-10T22:50:05.50Z",
    },
    {
      id: "iop765plk",
      amount: 574,
      status: "success",
      email: "rachel.baker@example.com",
      created_at: "2023-07-04T17:35:49.95Z",
    }
  ];
  
  export const getData = () => {
    return dummyData;
  }