// import individual components
import SubRow from './SubRow';
import Plugin from './Plugin';
import MessageContent from './MessageContent';

// create a new index.js file and re-export the components
export { SubRow };
export { Plugin };
export { MessageContent };

// or, alternatively, you can re-export them using object shorthand syntax
// const SubRow = './SubRow';
// const Plugin = './Plugin';
// const MessageContent = './MessageContent';
// export { SubRow, Plugin, MessageContent };
