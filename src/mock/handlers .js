import { rest } from 'msw';
/**
 * a list of handlers (endpoints) to emulate (mock) a actual implementation
 */
export const handlers = [
  rest.get('/ricky-rest', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        name: 'Rick Sanchez',
        description: 'Scientist extraordinaire',
      })
    );
  }),

  rest.post('/ricky-post', (req, res, ctx) => {
    const { item } = req.body;
    return res(
      ctx.status(200),
      ctx.json({
        message: `hey hey ${item}`,
      })
    );
  }),

  rest.get('/app/external-resource/users-info', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          name: 'admin admin',
          email: 'admin@aspnetboilerplate.com',
        },
        {
          name: 'admin admin',
          email: 'admintytyyt@aspnetboilerplate.com',
        },
        {
          name: 'Ân Bùi Hoàng',
          email: 'an.buihoang@ncc.asia',
        },
        {
          name: 'An Dư Văn',
          email: 'an.duvan@ncc.asia',
        },
        {
          name: 'Ân Lê Thị Hồng',
          email: 'an.lethihong@ncc.asia',
        },
        {
          name: 'An Lê Văn',
          email: 'an.levan@ncc.asia',
        },
        {
          name: 'An Nguyễn Danh',
          email: 'an.nguyendanh@ncc.asia',
        },
        {
          name: 'An Nguyễn Đình',
          email: 'an.nguyendinh@ncc.asia',
        },
        {
          name: 'Ân Nguyễn Thiên',
          email: 'an.nguyenthien@ncc.asia',
        },
        {
          name: 'Ân Nguyễn Trần Thy',
          email: 'an.nguyentranthy@ncc.asia',
        },
        {
          name: 'An Trần Hồng Nhật',
          email: 'an.tranhongnhat@ncc.asia',
        },
        {
          name: 'Anh Bùi Quỳnh',
          email: 'anh.buiquynh@ncc.asia',
        },
        {
          name: 'Anh Đào Văn',
          email: 'anh.daovan@ncc.asia',
        },
      ])
    );
  }),

  rest.get(`/app/task/${'3a0ea028-c2ae-9dde-38e1-da61cd0d831e'}/detail-by-id`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        tasks: {
          id: '3a0ea028-c2ae-9dde-38e1-da61cd0d831e',
          workflowInstanceId: '3a0ea028-bdd6-f66d-3600-2cf3d6584684',
          workflowDefinitionId: '3a057e11-7cde-1749-5c03-60520662a1f5',
          email: null,
          status: 1,
          name: 'Device Request',
          description: 'Send email to PM',
          dynamicActionData: null,
          reason: null,
          creationTime: '2023-11-02T03:02:58.999789Z',
          otherActionSignals: [],
          emailTo: null,
          author: '81676b37-5ab2-469a-b04b-63aaedb34b40',
          authorName: null,
        },
        emailTo: [
          'bang.phamphan@ncc.asia',
          'nhan.huynhba@ncc.asia',
          'cuong.nguyenduc@ncc.asia',
        ],
        otherActionSignals: [
          {
            otherActionSignal: 'SendToSale',
            status: 0,
          },
        ],
        input: {
          Request: {
            CurrentOffice: 'ĐN',
            Project: 'nca',
            Device: 'tesssttt',
            Reason: 'ahihihiiii',
          },
          RequestUser: {
            email: 'nhan.huynhba@ncc.asia',
            name: 'Nhan Huynh Ba',
            project: null,
            pm: 'thien.dang@ncc.asia',
            headOfOfficeEmail: 'thien.dang@ncc.asia',
            projectCode: 'asm',
            branchName: 'Đà Nẵng',
            branchCode: 'ĐN',
            id: '81676b37-5ab2-469a-b04b-63aaedb34b40',
          },
          EmailTemplate:
            '\n<div style="margin: 13px 0">\n    <b>Văn phòng đang làm việc: </b>Đà Nẵng\n</div>\n<div style="margin: 13px 0">\n    <b>Dự án: </b>[nca] Company Activities\n</div>\n<div style="margin: 13px 0">\n    <b>PM: </b>Vân Nguyễn Hồng, Nhung Nguyễn Thị, Hiền Ngô Thu, Anh Nguyễn Thị Phương\n</div>\n<div style="margin: 13px 0">\n    <b>Thiết bị cần request: </b>tesssttt\n</div>\n<div style="margin: 13px 0;display: flex">\n    <b>Lý do: </b>&#160;ahihihiiii\n</div>\n',
        },
      })
    );
  }),
];
