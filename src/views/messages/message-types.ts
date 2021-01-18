export type TextMessage = {
  type: 'text';
  data: {
    text: string;
  };
};

export type ImageMessage = {
  type: 'image';
  data: {
    file: string;
  };
};

export type FaceMessage = {
  type: 'face';
  data: {
    id: string;
  };
};

export type AtMessage = {
  type: 'at';
  data: {
    qq: string;
  };
};

export type Message = TextMessage | ImageMessage | FaceMessage | AtMessage;
