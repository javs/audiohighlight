/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import Gio from 'gi://Gio';

import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';

export default class AudioHighlightExtension extends Extension {
    enable() {
        this._original_osd = Main.panel.statusArea.quickSettings._volumeOutput._output.showOSD;

        Main.panel.statusArea.quickSettings._volumeOutput._output.showOSD = function() {
            const gicon = new Gio.ThemedIcon({name: this.getIcon()});
            const level = this.getLevel();
            const maxLevel = this.getMaxLevel();
            const label = this._stream.get_port().human_port // added
            Main.osdWindowManager.show(-1, gicon, label, level, maxLevel);
        }

        this._original_port = Main.panel.statusArea.quickSettings._volumeOutput._output._portChanged;

        Main.panel.statusArea.quickSettings._volumeOutput._output._portChanged = function() {
            const hasHeadphones = this._findHeadphones(this._stream);

            // removed
            // if (hasHeadphones === this._hasHeadphones)
            //     return;
            //const initializing = this._hasHeadphones === undefined;
            this._hasHeadphones = hasHeadphones;
            this._updateIcon();
            //if (!initializing)
                this.showOSD();
        }
    }

    disable() {
        Main.panel.statusArea.quickSettings._volumeOutput._output._portChanged = this._original_port;
        Main.panel.statusArea.quickSettings._volumeOutput._output.showOSD = this._original_osd;
    }
}
