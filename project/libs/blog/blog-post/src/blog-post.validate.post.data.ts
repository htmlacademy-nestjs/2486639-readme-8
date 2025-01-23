import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostField, PostFieldsByType } from './blog-post.constant';

export function validatePostData(dto: CreatePostDto | UpdatePostDto): string {
  const { type } = dto;
  const messages: string[] = [];
  const keys = Object.values(PostField);

  if (!type) {
    keys.forEach((key) => {
      if (dto[key]) {
        messages.push(key);
      }

      if (messages.length) {
        messages.unshift('For empty post type not need:');
      }
    })
  } else {
    const fields = PostFieldsByType[type];
    const needMessages: string[] = [];
    const notNeedMessages: string[] = [];

    keys.forEach((key) => {
      const shouldBeKey = [...fields].includes(key); // без [] Argument of type 'PostField' is not assignable to parameter of type 'never'
      const existDtoKey = !!dto[key];

      if (shouldBeKey && !existDtoKey) {
        needMessages.push(key);
      }

      if (!shouldBeKey && existDtoKey) {
        notNeedMessages.push(key);
      }
    })

    if (needMessages.length || notNeedMessages.length) {
      messages.push(`For post type "${type}"`);

      if (needMessages.length) {
        messages.push(`need: ${needMessages.join(', ')}`);
      }

      if (notNeedMessages.length) {
        if (needMessages.length) {
          messages.push('and');
        }
        messages.push(`not need: ${notNeedMessages.join(', ')}`);
      }
    }
  }

  return messages.join(' ');
}
