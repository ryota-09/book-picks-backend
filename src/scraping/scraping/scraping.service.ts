import { Injectable } from '@nestjs/common';
import { SearchTextDto } from '../dto/search-text.dto';
import * as puppeteer from 'puppeteer';
import { wait } from 'src/utils/wait';

export type ReturnInfoType = {
  message: string;
  bookInfoList: BookInfoType[];
};

export type BookInfoType = {
  title: string;
  src: string;
  link: string;
};

@Injectable()
export class ScrapingService {
  async scrapingBooks(searchText: SearchTextDto) {
    const random = Math.floor(Math.random() * 2);

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    await page.goto('https://google.com', { waitUntil: ['load'] });
    await page.waitForSelector('.gLFyf');
    await page.type('.gLFyf', searchText.searchText);
    await page.keyboard.down('Enter');
    await page.waitForSelector('h3');
    const targetElement = (await page.$$('h3'))[random];
    await targetElement.click();

    const bookInfoList: Pick<ReturnInfoType, 'bookInfoList'> = {
      bookInfoList: [],
    };

    await page.waitForSelector('h3');
    const url = await page.url();
    const titleList: { title: string }[] = await page.$$eval(
      'h3',
      (elementList) => {
        const newArray = [];
        for (const element of elementList) {
          if (element !== null) {
            if (element.textContent !== '') {
              newArray.push({
                title: element.textContent,
              });
            }
          }
        }
        return newArray;
      },
    );

    const makeBookInfo = async (title: string): Promise<BookInfoType> => {
      await page.goto('https://www.amazon.co.jp/');
      await page.waitForSelector('#twotabsearchtextbox');
      await page.type('#twotabsearchtextbox', title);
      await page.keyboard.down('Enter');

      await page.waitForSelector('.a-link-normal');
      const targetLink = await page.$eval('.a-link-normal', (element) =>
        element.getAttribute('href'),
      );

      await page.waitForSelector('.s-image');
      const targetSrc = await page.$eval('.s-image', (element) =>
        element.getAttribute('src'),
      );
      const targetAlt = await page.$eval('.s-image', (element) =>
        element.getAttribute('alt'),
      );
      return {
        title: targetAlt,
        src: targetSrc,
        link: `https://www.amazon.co.jp${targetLink}`,
      };
    };

    try {
      for (const title of titleList) {
        if (bookInfoList.bookInfoList.length <= 3) {
          bookInfoList.bookInfoList.push(await makeBookInfo(title.title));
        } else {
          break;
        }
      }
      return {
        message: 'success!!',
        url: url,
        bookInfoList: bookInfoList.bookInfoList,
      };
    } catch (error) {
      return {
        message: error,
        url: url,
        bookInfoList: bookInfoList.bookInfoList,
      };
    } finally {
      await browser.close();
    }
  }
}
