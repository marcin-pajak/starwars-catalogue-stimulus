export const mockFetch = (
  response: string,
  status: number = 200,
  statusText: string = ''
) => () =>
  Promise.resolve(
    new Response(response, {
      status: status,
      statusText: statusText,
      headers: {
        'Content-type': 'text/plain',
      },
    })
  );
